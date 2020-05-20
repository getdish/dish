import '@dish/common'

import { Restaurant, RestaurantTag, Tag, tagFindCountries } from '@dish/graph'
import { Dish, Scrape, ScrapeData } from '@dish/models'
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
  restaurant!: Restaurant
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
      const results = await Restaurant.fetchBatch(
        PER_PAGE,
        previous_id,
        {},
        sanfran
      )
      if (results.length == 0) {
        break
      }
      for (const result of results) {
        await this.runOnWorker('mergeAll', [result.id])
        previous_id = result.id
      }
    }
  }

  async mergeAll(id: string) {
    this._start_time = process.hrtime()
    let restaurant = new Restaurant()
    await restaurant.findOne('id', id)
    this.restaurant = restaurant
    console.log('Merging: ' + this.restaurant.name)
    await this.getScrapeData()
    await this.mergeMainData()
    await this.mergeTags()
    await this.findPhotosForTags()
    await this.scanReviews()
    await this.upsertUberDishes()
    console.log(`Merged: ${this.restaurant.name} in ${this.elapsedTime()}s`)
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
      await this.restaurant.update()
    } catch (e) {
      if (e.message == UNIQUNESS_VIOLATION) {
        this.handleRestaurantKeyConflict()
      } else {
        throw new Error(e)
      }
    }
  }

  async handleRestaurantKeyConflict() {
    if (this.restaurant.address.length < 4 || this.restaurant.name.length < 2) {
      console.error(
        this.restaurant.id,
        this.restaurant.name,
        this.restaurant.address
      )
      throw new Error('Not enough data to resolve restaurant conflict')
    }
    let conflicter = new Restaurant()
    await conflicter.findOneByHash({
      name: this.restaurant.name,
      address: this.restaurant.address,
    })
    const updated_at = moment(conflicter.updated_at)
    if (updated_at.diff(moment.now(), 'days') < -30) {
      console.log(
        'Deleting conflicting restaurant: ' +
          this.restaurant.name +
          ', ' +
          this.restaurant.id
      )
      await conflicter.delete()
      await this.persist()
    } else {
      throw new Error('Conflicting restaurant updated too recently')
    }
  }

  async getScrapeData() {
    this.yelp = await this.restaurant.getLatestScrape('yelp')
    this.ubereats = await this.restaurant.getLatestScrape('ubereats')
    this.infatuated = await this.restaurant.getLatestScrape('infatuation')
    this.michelin = await this.restaurant.getLatestScrape('michelin')
    this.tripadvisor = await this.restaurant.getLatestScrape('tripadvisor')
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
      this.tripadvisor.getData('overview.name')
    )
    this.restaurant.name = this.merge([
      this.yelp.getData('data_from_map_search.name'),
      this.ubereats.getData('main.title'),
      this.infatuated.getData('data_from_map_search.name'),
      this.michelin.getData('main.name'),
      tripadvisor_name,
    ])
  }

  mergeTelephone() {
    this.restaurant.telephone = this.merge([
      this.yelp.getData('data_from_map_search.phone'),
      this.ubereats.getData('main.phoneNumber'),
      this.infatuated.getData('data_from_html_embed.phone_number'),
      this.tripadvisor.getData('overview.contact.phone'),
    ])
  }

  mergeRatings() {
    this.ratings = {
      yelp: parseFloat(this.yelp.getData('data_from_map_search.rating')),
      ubereats: parseFloat(this.ubereats.getData('main.rating.ratingValue')),
      infatuated: this._infatuatedRating(),
      tripadvisor: parseFloat(
        this.tripadvisor.getData('overview.rating.primaryRating')
      ),
      michelin: this._getMichelinRating(),
    }
    this.restaurant.rating = this.weightRatings(
      this.ratings,
      Restaurant.WEIGHTS
    )
  }

  _infatuatedRating() {
    const rating = this.infatuated.getData('data_from_map_search.post.rating')
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
    const rating = this.michelin.getData('main.michelin_award')
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
      this.yelp.getData(yelp_address_path, ['']).join(', '),
      this.ubereats.getData('main.location.address'),
      this.infatuated.getData('data_from_map_search.street'),
      this.michelin.getData('main.title'),
      this.tripadvisor.getData('overview.contact.address'),
    ])
  }

  addWebsite() {
    let website = this.tripadvisor.getData('overview.contact.website')
    website = Base64.decode(website)
    const parts = website.split('_')
    parts.shift()
    parts.pop()
    this.restaurant.website = parts.join('_')
  }

  addPriceRange() {
    this.restaurant.price_range = this.tripadvisor.getData(
      'overview.detailCard.numericalPrice'
    )
  }

  addHours() {
    this.restaurant.hours = this.yelp.getData(
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

    path = this.tripadvisor.getData('overview.links.warUrl')
    if (path != '') {
      parts = path.split('-')
      parts.shift()
      url = 'https://www.tripadvisor.com/' + parts.join('-')
      this.restaurant.sources.tripadvisor = {
        url: url,
        rating: this.ratings?.tripadvisor,
      }
    }

    path = this.yelp.getData('data_from_map_search.businessUrl')
    if (path != '') {
      this.restaurant.sources.yelp = {
        url: 'https://www.yelp.com' + path,
        rating: this.ratings?.yelp,
      }
    }

    path = this.infatuated.getData('data_from_map_search.post.review_link')
    if (path != '') {
      this.restaurant.sources.infatuated = {
        url: 'https://www.theinfatuation.com' + path,
        rating: this.ratings?.infatuated,
      }
    }

    path = this.michelin.getData('main.url')
    if (path != '') {
      this.restaurant.sources.michelin = {
        url: 'https://guide.michelin.com' + path,
        rating: this.ratings?.michelin,
      }
    }

    const json = JSON.parse(this.ubereats.getData('main.metaJson', '"{}"'))
    if (json['@id']) {
      this.restaurant.sources.ubereats = {
        url: json['@id'],
        rating: this.ratings?.ubereats,
      }
    }
  }

  mergeImage() {
    let hero = ''
    const yelps = this.yelp.getData(
      'data_from_html_embed.photoHeaderProps.photoHeaderMedias'
    )
    if (yelps) {
      hero = yelps[0].srcUrl
    }
    const infatuateds = this.infatuated.getData(
      'data_from_map_search.post.venue_image'
    )
    if (infatuateds) {
      hero = infatuateds
    }
    const michelins = this.michelin.getData('main.image')
    if (michelins) {
      hero = michelins
    }

    this.restaurant.image = hero
  }

  async mergeTags() {
    const yelps = this.yelp
      .getData('data_from_map_search.categories', [])
      .map((c) => c.title)
    const tripadvisors = this.tripadvisor
      .getData('overview.detailCard.tagTexts.cuisines.tags', [])
      .map((c) => c.tagValue)
    const tags = _.uniq([...yelps, ...tripadvisors])
    const orphan_tags = await this.upsertCountryTags(tags)
    await this.restaurant.upsertOrphanTags(orphan_tags)
    await this.updateTagRankings()
  }

  async upsertCountryTags(tags: string[]) {
    const country_tags = await tagFindCountries(tags)
    await this.restaurant.upsertManyTags(
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
    if (!this.ubereats.id) {
      return
    }
    for (const data of this.ubereats.data.dishes) {
      const dish = new Dish({
        restaurant_id: this.restaurant.id,
        name: data.title,
        description: data.description,
        price: data.price,
        image: data.imageUrl,
      })
      if (dish.name) {
        await dish.upsert()
      }
    }
  }

  mergePhotos() {
    // ...this.tripadvisor.getData('photos', []),
    this.restaurant.photos = [
      ...this.getPaginatedData(this.yelp.data, 'photos').map((i) => i.src),
    ]
  }

  async updateTagRankings() {
    let restaurant_tags = [] as RestaurantTagWithID[]
    await Promise.all(
      (this.restaurant.tags || []).map(async (i) => {
        restaurant_tags.push({
          tag_id: i.tag.id,
          rank: await this.getRankForTag(new Tag(i.tag)),
        })
      })
    )
    await this.restaurant.upsertTagRestaurantData(restaurant_tags)
  }

  async getRankForTag(tag: Tag) {
    const RADIUS = 0.1
    const tag_name = tag.slug()
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
    this.all_tags = await this.restaurant.allPossibleTags()
    this.restaurant_tag_ratings = {}
    this._scanYelpReviewsForTags()
    this._scanTripadvisorReviewsForTags()
    await this._averageAndPersistTagRatings()
  }

  async findPhotosForTags() {
    let restaurant_tags = [] as RestaurantTagWithID[]
    await this.restaurant.refresh()
    const all_possible_tags = await this.restaurant.allPossibleTags()
    const photos = this.getPaginatedData(this.yelp.data, 'photos')
    for (const tag of all_possible_tags) {
      let restaurant_tag = {
        tag_id: tag.id,
      } as RestaurantTagWithID
      restaurant_tag.photos = restaurant_tag?.photos || []
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
    await this.restaurant.upsertManyTags(restaurant_tags)
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
      if (!this._doesStringContainTag(text, tag.name)) continue
      this._found_tags[tag.id] = { tag_id: tag.id } as RestaurantTag
      this.measureSentiment(text, tag)
    }
  }

  _doesStringContainTag(text: string, tag_name: string) {
    const regex = new RegExp(`\\b${tag_name}\\b`, 'i')
    return regex.test(text)
  }

  measureSentiment(text: string, tag: Tag) {
    const sentiment = new Sentiment()
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
    this.restaurant_tag_ratings[tag.id] =
      this.restaurant_tag_ratings[tag.id] || []
    for (const sentence of sentences) {
      if (!this._doesStringContainTag(sentence, tag.name)) continue
      const rating = sentiment.analyze(sentence).score
      this.restaurant_tag_ratings[tag.id].push(rating)
    }
  }

  async _averageAndPersistTagRatings() {
    let restaurant_tags = [] as RestaurantTagWithID[]
    for (const tag_id of Object.keys(this.restaurant_tag_ratings)) {
      restaurant_tags.push({
        tag_id: tag_id,
        rating: _.mean(this.restaurant_tag_ratings[tag_id]),
      })
    }
    await this.restaurant.upsertManyTags(restaurant_tags)
  }

  getRatingFactors() {
    const factors = this.tripadvisor.getData(
      'overview.rating.ratingQuestions',
      []
    )
    this.restaurant.rating_factors = {
      food: factors.find((i) => i.name == 'Food')?.rating / 10,
      service: factors.find((i) => i.name == 'Service')?.rating / 10,
      value: factors.find((i) => i.name == 'Value')?.rating / 10,
      ambience: factors.find((i) => i.name == 'Atmosphere')?.rating / 10,
    }
  }

  _scanYelpReviewsForTags() {
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
    const reviews = this.getPaginatedData(this.tripadvisor.data, 'reviews')
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
