import '@dish/common'

import { sentryException } from '@dish/common'
import {
  RESTAURANT_WEIGHTS,
  RestaurantWithId,
  Scrape,
  ScrapeData,
  deleteAllBy,
  menuItemUpsert,
  restaurantFindBatch,
  restaurantFindOne,
  restaurantFindOneWithTags,
  restaurantGetLatestScrape,
  restaurantUpdate,
  restaurantUpsertManyTags,
  scrapeGetData,
} from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import { Base64 } from 'js-base64'
import _ from 'lodash'
import moment from 'moment'

import { Tripadvisor } from '../tripadvisor/Tripadvisor'
import { sanfran } from '../utils'
import { Tagging } from './Tagging'

const PER_PAGE = 50

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
  _start_time!: [number, number]
  tagging: Tagging

  static queue_config: QueueOptions = {
    limiter: {
      max: 50,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  constructor() {
    super()
    this.tagging = new Tagging(this)
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
    await this.tagging.setDefaultTagImages()
  }

  async mergeAll(id: string) {
    const restaurant = await restaurantFindOneWithTags({ id: id })
    if (restaurant) {
      await this.preMerge(restaurant)
      const async_steps = [
        this.mergeMainData,
        this.doTags,
        this.findPhotosForTags,
        this.scanReviews,
        this.upsertUberDishes,
      ]
      for (const async_func of async_steps) {
        await this._runFailableFunction(async_func)
      }
      await this.postMerge()
      console.log(`Merged: ${this.restaurant.name}`)
    }
    return this.restaurant
  }

  async preMerge(restaurant: RestaurantWithId) {
    this.restaurant = restaurant
    console.log('Merging: ' + this.restaurant.name)
    this._start_time = process.hrtime()
    await this.getScrapeData()
    this.logTime('scrapes fetched')
  }

  async postMerge() {
    this.resetTimer()
    await restaurantUpsertManyTags(
      this.restaurant,
      this.tagging.restaurant_tags
    )
    await this.tagging.updateTagRankings()
    this.logTime('postMerge()')
  }

  async mergeMainData() {
    ;[
      this.mergeName,
      this.mergeTelephone,
      this.mergeAddress,
      this.mergeRatings,
      this.mergeImage,
      this.mergePhotos,
      this.addWebsite,
      this.addSources,
      this.addPriceRange,
      this.addHours,
      this.getRatingFactors,
    ].forEach((func) => {
      this._runFailableFunction(func)
    })
    await this.persist()
  }

  async _runFailableFunction(func: Function) {
    this._start_time = process.hrtime()
    try {
      if (func.constructor.name == 'AsyncFunction') {
        await func.bind(this)()
      } else {
        func.bind(this)()
      }
    } catch (e) {
      sentryException(
        e,
        { function: func.name, restaurant: this.restaurant.name },
        { source: 'Self crawler' }
      )
    }
    this.logTime(func.name)
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

  async doTags() {
    await this.tagging.main()
  }

  async findPhotosForTags() {
    await this.tagging.findPhotosForTags()
  }

  async scanReviews() {
    await this.tagging.scanReviews()
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

    // @ts-ignore
    this.restaurant.sources = {} as {
      [key: string]: { url: string; rating: number }
    }

    path = scrapeGetData(this.tripadvisor, 'overview.links.warUrl')
    if (path != '') {
      parts = path.split('-')
      parts.shift()
      url = 'https://www.tripadvisor.com/' + parts.join('-')
      // @ts-ignore
      this.restaurant.sources.tripadvisor = {
        url: url,
        rating: this.ratings?.tripadvisor,
      }
    }

    path = scrapeGetData(this.yelp, 'data_from_map_search.businessUrl')
    if (path != '') {
      // @ts-ignore
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
      // @ts-ignore
      this.restaurant.sources.infatuated = {
        url: 'https://www.theinfatuation.com' + path,
        rating: this.ratings?.infatuated,
      }
    }

    path = scrapeGetData(this.michelin, 'main.url')
    if (path != '') {
      // @ts-ignore
      this.restaurant.sources.michelin = {
        url: 'https://guide.michelin.com' + path,
        rating: this.ratings?.michelin,
      }
    }

    const json = JSON.parse(
      scrapeGetData(this.ubereats, 'main.metaJson', '"{}"')
    )
    if (json['@id']) {
      // @ts-ignore
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

  async upsertUberDishes() {
    if (!this.ubereats?.id) {
      return
    }
    // @ts-ignore
    const dishes = this.ubereats?.data?.dishes
    for (const data of dishes) {
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
    // @ts-ignore
    const yelp_data = this.yelp?.data || {}
    // @ts-ignore
    this.restaurant.photos = [
      // ...scrapeGetData(this.tripadvisor, 'photos', []),
      ...this.getPaginatedData(yelp_data, 'photos').map((i) => i.src),
    ]
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

  resetTimer() {
    this._start_time = process.hrtime()
  }

  logTime(message: string) {
    if (process.env.LOG_TIMINGS != '1') return
    console.log(message + ' ' + this.elapsedTime() + 's')
  }
}
