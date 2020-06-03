import '@dish/common'

import {
  RESTAURANT_WEIGHTS,
  RestaurantTag,
  RestaurantTagWithID,
  RestaurantWithId,
  Scrape,
  ScrapeData,
  Tag,
  deleteAllBy,
  menuItemUpsert,
  restaurantFindBatch,
  restaurantFindOne,
  restaurantFindOneWithTags,
  restaurantGetAllPossibleTags,
  restaurantGetLatestScrape,
  restaurantUpdate,
  restaurantUpsertManyTags,
  restaurantUpsertOrphanTags,
  scrapeGetData,
  tagFindCountries,
  tagSlug,
} from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import { Base64 } from 'js-base64'
import _ from 'lodash'
import moment from 'moment'
import Sentiment from 'sentiment'

import { Tripadvisor } from '../tripadvisor/Tripadvisor'
import { sql } from '../utils'

const PER_PAGE = 50

const sanfran = {
  location: {
    _st_d_within: {
      distance: 0.5,
      from: {
        type: 'Point',
        coordinates: [-122.421351, 37.759251],
      },
    },
  },
}

const UNIQUNESS_VIOLATION =
  'Uniqueness violation. duplicate key value violates ' +
  'unique constraint "restaurant_name_address_key"'

export class Self extends WorkerJob {
  yelp!: Scrape
  ubereats!: Scrape
  infatuated!: Scrape
  michelin!: Scrape
  tripadvisor!: Scrape
  restaurant!: RestaurantWithId
  ratings!: { [key: string]: number }
  restaurant_tag_ratings!: {
    [key: string]: number[]
  }
  all_tags!: Tag[]
  _found_tags!: { [key: string]: Partial<RestaurantTag> }
  _start_time!: [number, number]

  static queue_config: QueueOptions = {
    limiter: {
      max: 50,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async main() {
    let previous_id = '00000000-0000-0000-0000-000000000000'
    while (true) {
      const results = await restaurantFindBatch(PER_PAGE, previous_id, sanfran)
      if (results.length == 0) {
        break
      }
      for (const result of results) {
        await this.runOnWorker('mergeAll', [result.id])
        previous_id = result.id as string
      }
    }
  }

  async mergeAll(id: string) {
    this._start_time = process.hrtime()
    const restaurant = await restaurantFindOneWithTags({ id: id })
    if (restaurant) {
      this.restaurant = restaurant as RestaurantWithId
      console.log('Merging: ' + this.restaurant.name)
      await this.getScrapeData()
      await this.mergeMainData()
      await this.mergeTags()
      await this.findPhotosForTags()
      await this.scanReviews()
      await this.upsertUberDishes()
      console.log(`Merged: ${this.restaurant.name} in ${this.elapsedTime()}s`)
    }
    return this.restaurant
  }

  async mergeMainData() {
    this.mergeName()
    this.mergeTelephone()
    this.mergeAddress()
    this.mergeRatings()
    this.mergeImage()
    this.mergePhotos()
    this.addWebsite()
    this.addSources()
    this.addPriceRange()
    this.addHours()
    this.getRatingFactors()
    await this.persist()
  }

  async persist() {
    try {
      await restaurantUpdate(this.restaurant)
    } catch (e) {
      if (e.message == UNIQUNESS_VIOLATION) {
        this.handleRestaurantKeyConflict()
      } else {
        throw e
      }
    }
  }

  async handleRestaurantKeyConflict() {
    const { restaurant } = this
    if (!restaurant) return
    if (
      (restaurant.address?.length ?? 0) < 4 ||
      (restaurant.name ?? '').length < 2
    ) {
      throw new Error('Not enough data to resolve restaurant conflict')
    }
    const conflicter = await restaurantFindOne({
      name: restaurant.name,
      address: restaurant.address ?? '',
    })
    if (!conflicter) {
      return
    }
    const updated_at = moment(conflicter.updated_at)
    if (updated_at.diff(moment.now(), 'days') < -30) {
      console.log(
        'Deleting conflicting restaurant: ' +
          restaurant.name +
          ', ' +
          restaurant.id
      )
      await deleteAllBy('restaurant', 'id', conflicter.id)
    } else {
      throw new Error('Conflicting restaurant updated too recently')
    }
  }

  async getScrapeData() {
    this.yelp = await restaurantGetLatestScrape(this.restaurant, 'yelp')
    this.ubereats = await restaurantGetLatestScrape(this.restaurant, 'ubereats')
    this.infatuated = await restaurantGetLatestScrape(
      this.restaurant,
      'infatuation'
    )
    this.michelin = await restaurantGetLatestScrape(this.restaurant, 'michelin')
    this.tripadvisor = await restaurantGetLatestScrape(
      this.restaurant,
      'tripadvisor'
    )
  }

  // TODO: If we really want to be careful about being found out for scraping then we
  // need at least 2 identical sources and something better than just resorting to the
  // shortest version.
  merge(strings: string[]) {
    let overlaps: string[] = []
    for (let pair of Self.allPairs(strings)) {
      const overlap = Self.findOverlap(pair[0], pair[1])
      if (overlap) {
        overlaps.push(overlap)
      }
    }

    const shortest_string = Self.shortestString(strings)
    const shortest_overlap = Self.shortestString(overlaps)
    if (shortest_overlap.length) {
      return shortest_overlap
    } else {
      return shortest_string
    }
  }

  mergeName() {
    const tripadvisor_name = Tripadvisor.cleanName(
      scrapeGetData(this.tripadvisor, 'overview.name')
    )
    this.restaurant.name = this.merge([
      scrapeGetData(this.yelp, 'data_from_map_search.name'),
      scrapeGetData(this.ubereats, 'main.title'),
      scrapeGetData(this.infatuated, 'data_from_map_search.name'),
      scrapeGetData(this.michelin, 'main.name'),
      tripadvisor_name,
    ])
  }

  mergeTelephone() {
    this.restaurant.telephone = this.merge([
      scrapeGetData(this.yelp, 'data_from_map_search.phone'),
      scrapeGetData(this.ubereats, 'main.phoneNumber'),
      scrapeGetData(this.infatuated, 'data_from_html_embed.phone_number'),
      scrapeGetData(this.tripadvisor, 'overview.contact.phone'),
    ])
  }

  mergeRatings() {
    this.ratings = {
      yelp: parseFloat(scrapeGetData(this.yelp, 'data_from_map_search.rating')),
      ubereats: parseFloat(
        scrapeGetData(this.ubereats, 'main.rating.ratingValue')
      ),
      infatuated: this._infatuatedRating(),
      tripadvisor: parseFloat(
        scrapeGetData(this.tripadvisor, 'overview.rating.primaryRating')
      ),
      michelin: this._getMichelinRating(),
    }
    this.restaurant.rating = this.weightRatings(
      this.ratings,
      RESTAURANT_WEIGHTS
    )
  }

  _infatuatedRating() {
    const rating = scrapeGetData(
      this.infatuated,
      'data_from_map_search.post.rating'
    )
    if (rating < 0) return NaN
    return parseFloat(rating) / 2
  }

  weightRatings(
    ratings: { [source: string]: number },
    master_weights: { [source: string]: number }
  ) {
    let weights: { [source: string]: number } = {}
    let total_weight = 0
    let final_rating = 0
    Object.entries(ratings).forEach(([source, rating]) => {
      if (Number.isNaN(rating)) {
        delete ratings[source]
      } else {
        weights[source] = master_weights[source]
        total_weight += master_weights[source]
      }
    })
    Object.entries(ratings).forEach(([source, rating]) => {
      const normalised_weight = weights[source] / total_weight
      final_rating += rating * normalised_weight
    })
    return final_rating
  }

  private _getMichelinRating() {
    const rating = scrapeGetData(this.michelin, 'main.michelin_award')
    if (rating == '') {
      return NaN
    }
    switch (rating) {
      case 'ONE_STAR':
        return 4.8
      case 'TWO_STARS':
        return 4.9
      case 'THREE_STARS':
        return 5.0
      default:
        return 4.7
    }
  }

  mergeAddress() {
    const yelp_address_path =
      'data_from_html_embed.mapBoxProps.addressProps.addressLines'
    this.restaurant.address = this.merge([
      scrapeGetData(this.yelp, yelp_address_path, ['']).join(', '),
      scrapeGetData(this.ubereats, 'main.location.address'),
      scrapeGetData(this.infatuated, 'data_from_map_search.street'),
      scrapeGetData(this.michelin, 'main.title'),
      scrapeGetData(this.tripadvisor, 'overview.contact.address'),
    ])
  }

  addWebsite() {
    let website = scrapeGetData(this.tripadvisor, 'overview.contact.website')
    website = Base64.decode(website)
    const parts = website.split('_')
    parts.shift()
    parts.pop()
    this.restaurant.website = parts.join('_')
  }

  addPriceRange() {
    this.restaurant.price_range = scrapeGetData(
      this.tripadvisor,
      'overview.detailCard.numericalPrice'
    )
  }

  addHours() {
    this.restaurant.hours = scrapeGetData(
      this.yelp,
      'data_from_html_embed.bizHoursProps.hoursInfoRows',
      []
    )
  }

  addSources() {
    let url: string
    let path: string
    let parts: string[]

    this.restaurant.sources = {} as {
      [key: string]: { url: string; rating: number }
    }

    path = scrapeGetData(this.tripadvisor, 'overview.links.warUrl')
    if (path != '') {
      parts = path.split('-')
      parts.shift()
      url = 'https://www.tripadvisor.com/' + parts.join('-')
      this.restaurant.sources.tripadvisor = {
        url: url,
        rating: this.ratings?.tripadvisor,
      }
    }

    path = scrapeGetData(this.yelp, 'data_from_map_search.businessUrl')
    if (path != '') {
      this.restaurant.sources.yelp = {
        url: 'https://www.yelp.com' + path,
        rating: this.ratings?.yelp,
      }
    }

    path = scrapeGetData(
      this.infatuated,
      'data_from_map_search.post.review_link'
    )
    if (path != '') {
      this.restaurant.sources.infatuated = {
        url: 'https://www.theinfatuation.com' + path,
        rating: this.ratings?.infatuated,
      }
    }

    path = scrapeGetData(this.michelin, 'main.url')
    if (path != '') {
      this.restaurant.sources.michelin = {
        url: 'https://guide.michelin.com' + path,
        rating: this.ratings?.michelin,
      }
    }

    const json = JSON.parse(
      scrapeGetData(this.ubereats, 'main.metaJson', '"{}"')
    )
    if (json['@id']) {
      this.restaurant.sources.ubereats = {
        url: json['@id'],
        rating: this.ratings?.ubereats,
      }
    }
  }

  mergeImage() {
    let hero = ''
    const yelps = scrapeGetData(
      this.yelp,
      'data_from_html_embed.photoHeaderProps.photoHeaderMedias'
    )
    if (yelps) {
      hero = yelps[0].srcUrl
    }
    const infatuateds = scrapeGetData(
      this.infatuated,
      'data_from_map_search.post.venue_image'
    )
    if (infatuateds) {
      hero = infatuateds
    }
    const michelins = scrapeGetData(this.michelin, 'main.image')
    if (michelins) {
      hero = michelins
    }

    this.restaurant.image = hero
  }

  async mergeTags() {
    const yelps = scrapeGetData(
      this.yelp,
      'data_from_map_search.categories',
      []
    ).map((c) => c.title)
    const tripadvisors = scrapeGetData(
      this.tripadvisor,
      'overview.detailCard.tagTexts.cuisines.tags',
      []
    ).map((c) => c.tagValue)
    const tags = _.uniq([...yelps, ...tripadvisors])
    const orphan_tags = await this.upsertCountryTags(tags)
    if (orphan_tags) {
      await restaurantUpsertOrphanTags(this.restaurant, orphan_tags)
    }
    await this.updateTagRankings()
  }

  async upsertCountryTags(tags: string[]) {
    const country_tags = await tagFindCountries(tags)
    await restaurantUpsertManyTags(
      this.restaurant,
      country_tags.map((tag: Tag) => {
        return {
          tag_id: tag.id,
        }
      })
    )
    return this._extractOrphanTags(tags, country_tags)
  }

  _extractOrphanTags(tags: string[], country_tags: Tag[]) {
    return tags.filter((tag) => {
      const is_not_a_country_name = !country_tags.find((ct) => {
        const is_common_name_match = ct.name == tag
        const is_alternate_name_match = (ct.alternates || ['']).includes(tag)
        return is_common_name_match || is_alternate_name_match
      })
      return is_not_a_country_name
    })
  }

  async upsertUberDishes() {
    if (!this.ubereats?.id) {
      return
    }
    for (const data of this.ubereats?.data?.dishes) {
      if (data.title) {
        await menuItemUpsert([
          {
            restaurant_id: this.restaurant.id,
            name: data.title,
            description: data.description,
            price: data.price,
            image: data.imageUrl,
          },
        ])
      }
    }
  }

  mergePhotos() {
    this.restaurant.photos = [
      // ...scrapeGetData(this.tripadvisor, 'photos', []),
      ...this.getPaginatedData(this.yelp?.data, 'photos').map((i) => i.src),
    ]
  }

  async updateTagRankings() {
    let restaurant_tags = [] as RestaurantTagWithID[]
    this.restaurant = (await restaurantFindOneWithTags(this.restaurant))!
    await Promise.all(
      (this.restaurant.tags || []).map(async (i) => {
        restaurant_tags.push({
          tag_id: i.tag.id,
          rank: await this.getRankForTag(i.tag),
        })
      })
    )
    this.restaurant = (await restaurantUpsertManyTags(
      this.restaurant,
      restaurant_tags
    ))!
  }

  async getRankForTag(tag: Tag) {
    const RADIUS = 0.1
    const tag_name = tagSlug(tag)
    const result = await sql(
      `SELECT rank FROM (
        SELECT id, DENSE_RANK() OVER(ORDER BY rating DESC NULLS LAST) AS rank
        FROM restaurant WHERE
          ST_DWithin(location, location, ${RADIUS})
          AND
          tag_names @> '"${tag_name}"'
      ) league
      WHERE id = '${this.restaurant.id}'`
    )
    return parseInt(result.rows[0].rank)
  }

  async scanReviews() {
    this._found_tags = {}
    this.all_tags = await restaurantGetAllPossibleTags(this.restaurant)
    this.restaurant_tag_ratings = {}
    this._scanYelpReviewsForTags()
    this._scanTripadvisorReviewsForTags()
    await this._averageAndPersistTagRatings()
  }

  async findPhotosForTags() {
    let restaurant_tags = [] as RestaurantTagWithID[]
    const all_possible_tags = await restaurantGetAllPossibleTags(
      this.restaurant
    )
    if (this.yelp.data) {
      const photos = this.getPaginatedData(this.yelp.data, 'photos')
      for (const tag of all_possible_tags) {
        let restaurant_tag: RestaurantTag = {
          tag_id: tag.id,
          photos: [] as string[],
        }
        for (const photo of photos) {
          if (this._doesStringContainTag(photo.media_data?.caption, tag.name)) {
            restaurant_tag.photos.push(photo.src)
          }
        }
        if (restaurant_tag.photos.length > 0) {
          restaurant_tag.photos = _.uniq(restaurant_tag.photos)
          restaurant_tags.push(restaurant_tag)
        }
      }
    }
    await restaurantUpsertManyTags(this.restaurant, restaurant_tags)
  }

  getPaginatedData(data: ScrapeData, type: 'photos' | 'reviews') {
    let items: any[] = []
    let page = 0
    let key: string | undefined
    if (!data) {
      return []
    }
    while (true) {
      const base = type + 'p' + page
      const variations = [base, base.replace('reviews', 'review')]
      key = variations.find((i) => data.hasOwnProperty(i))
      if (key) {
        items = items.concat(data[key])
      } else {
        // Allow scrapers to start their pages on both 0 and 1
        if (page > 0) {
          break
        }
      }
      page++
    }
    return items
  }

  findDishesInText(text: string) {
    for (const tag of this.all_tags) {
      if (!this._doesStringContainTag(text, tag.name ?? '')) continue
      this._found_tags[tag.id] = { tag_id: tag.id } as RestaurantTag
      this.measureSentiment(text, tag)
    }
  }

  _doesStringContainTag(text: string, tag_name: string | undefined) {
    if (typeof tag_name === 'undefined') return false
    const regex = new RegExp(`\\b${tag_name}\\b`, 'i')
    return regex.test(text)
  }

  measureSentiment(text: string, tag: Tag) {
    const sentiment = new Sentiment()
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
    this.restaurant_tag_ratings[tag.id] =
      this.restaurant_tag_ratings[tag.id] || []
    for (const sentence of sentences) {
      if (!this._doesStringContainTag(sentence, tag.name ?? '')) continue
      const rating = sentiment.analyze(sentence).score
      this.restaurant_tag_ratings[tag.id].push(rating)
    }
  }

  async _averageAndPersistTagRatings() {
    let restaurant_tags = [] as RestaurantTagWithID[]
    for (const tag_id of Object.keys(this.restaurant_tag_ratings)) {
      restaurant_tags.push({
        tag_id: tag_id,
        rating: this._calculateTagRating(this.restaurant_tag_ratings[tag_id]),
      })
    }
    await restaurantUpsertManyTags(this.restaurant, restaurant_tags)
  }

  _calculateTagRating(ratings: number[]) {
    const averaged = _.mean(ratings)
    const normalised = this._normaliseTagRating(averaged)
    const max_restaurant_rating = 5
    const neutral = max_restaurant_rating / 2
    const amplifier = (this.restaurant.rating - neutral) / neutral
    let potential = 0
    if (amplifier > 0) {
      potential = (1 - normalised) / 2
    } else {
      potential = normalised / 2
    }
    const weight = potential * amplifier
    const weighted = normalised + weight
    return weighted
  }

  _normaliseTagRating(rating: number) {
    let normalised: number = 0
    const percentiles = this._getApproximatedDistribution()
    let lower: number = 0
    let upper: number = 0
    if (rating <= percentiles[0]) return 0
    if (rating >= percentiles[percentiles.length - 1]) return 1
    for (let i = 0; i < percentiles.length; i++) {
      normalised = i
      lower = percentiles[i]
      upper = percentiles[i + 1]
      if (rating >= lower && rating < upper) break
    }
    const distance_between = 1 - (upper - rating) / (upper - lower)
    normalised += distance_between
    return normalised / (percentiles.length - 1)
  }

  // All the percentiles for our tag rankings. You can get them with statements like:
  // ```
  // select percentile_disc(0.5) within group (order by restaurant_tag.rating)
  //   from restaurant_tag
  // ```
  _getApproximatedDistribution() {
    return [-15, -0.001, 0.001, 0.666, 1.081, 1.5, 2, 2.272, 3, 4, 44]
  }

  getRatingFactors() {
    const factors = scrapeGetData(
      this.tripadvisor,
      'overview.rating.ratingQuestions',
      []
    )
    // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
    this.restaurant.rating_factors = {
      food: factors.find((i) => i.name == 'Food')?.rating / 10,
      service: factors.find((i) => i.name == 'Service')?.rating / 10,
      value: factors.find((i) => i.name == 'Value')?.rating / 10,
      ambience: factors.find((i) => i.name == 'Atmosphere')?.rating / 10,
    }
  }

  _scanYelpReviewsForTags() {
    // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
    const reviews = this.getPaginatedData(this.yelp.data, 'reviews')
    for (const review of reviews) {
      const all_text = [
        review.comment?.text,
        review.lightboxMediaItems?.map((i) => i.caption).join(' '),
      ].join(' ')
      this.findDishesInText(all_text)
    }
  }

  _scanTripadvisorReviewsForTags() {
    const reviews = this.getPaginatedData(this.tripadvisor?.data, 'reviews')
    for (const review of reviews) {
      const all_text = [review.text].join(' ')
      this.findDishesInText(all_text)
    }
  }

  private static shortestString(arr: string[]) {
    arr = arr.filter((el) => {
      return el != null && el != ''
    })
    if (arr.length) {
      return arr.reduce((a, b) => (a.length <= b.length ? a : b))
    } else {
      return ''
    }
  }

  private static allPairs(arr: string[]) {
    return arr.map((v, i) => arr.slice(i + 1).map((w) => [v, w])).flat()
  }

  private static findOverlap(a: string, b: string) {
    if (a.includes(b)) {
      return b
    }
    if (b.includes(a)) {
      return a
    }
    return null
  }

  elapsedTime() {
    const elapsed = process.hrtime(this._start_time)[0]
    this._start_time = process.hrtime()
    return elapsed
  }
}
