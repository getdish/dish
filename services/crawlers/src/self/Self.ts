import '@dish/common'

import { sentryException } from '@dish/common'
import {
  MenuItem,
  PhotoXref,
  RESTAURANT_WEIGHTS,
  RestaurantWithId,
  Scrape,
  ScrapeData,
  deleteAllBy,
  globalTagId,
  menuItemsUpsertMerge,
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
import moment from 'moment'

import { Tripadvisor } from '../tripadvisor/Tripadvisor'
import { sanfran, sql } from '../utils'
import {
  DO_BASE,
  bestPhotosForRestaurant,
  bestPhotosForRestaurantTags,
  findHeroImage,
  photoUpsert,
  photoXrefUpsert,
  sendToDO,
  uploadHeroImage,
} from './photo-helpers'
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
  doordash!: Scrape
  grubhub!: Scrape
  google!: Scrape

  restaurant!: RestaurantWithId
  ratings!: { [key: string]: number }
  _start_time!: [number, number]
  tagging: Tagging
  menu_items: MenuItem[] = []

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
    let previous_id = globalTagId
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
        this.mergePhotos,
        this.mergeImage,
        this.mergeMainData,
        this.addHours,
        this.doTags,
        this.addPriceTags,
        this.findPhotosForTags,
        this.getUberDishes,
        this.getDoorDashDishes,
        this.getGrubHubDishes,
        this.scanCorpus,
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
    this.resetTimer()
    await this.getScrapeData()
    this.logTime('scrapes fetched')
  }

  async postMerge() {
    this.resetTimer()
    this.tagging.deDepulicateTags()
    await restaurantUpsertManyTags(
      this.restaurant,
      this.tagging.restaurant_tags
    )
    await this.tagging.updateTagRankings()
    if (this.menu_items.length != 0) {
      await menuItemsUpsertMerge(this.menu_items)
    }
    this.logTime('postMerge()')
  }

  async mergeMainData() {
    ;[
      this.mergeName,
      this.mergeTelephone,
      this.mergeAddress,
      this.mergeRatings,
      this.addWebsite,
      this.addSources,
      this.addPriceRange,
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

  async addPriceTags() {
    if (this.restaurant.price_range?.includes('$')) {
      let word: string = ''
      switch (this.restaurant.price_range) {
        case '$':
          word = 'low'
          break
        case '$$':
          word = 'mid'
          break
        case '$$$':
          word = 'high'
          break
        case '$$$$':
          word = 'higher'
          break
        case '$$$$$':
          word = 'highest'
          break
      }
      if (word != '') {
        await this.tagging.addSimpleTags(['price-' + word])
      }
    }
  }

  async findPhotosForTags() {
    const all_tag_photos = await this.tagging.findPhotosForTags()
    await photoUpsert(all_tag_photos)
    const most_aesthetic = await bestPhotosForRestaurantTags(this.restaurant.id)
    for (const photo_xref of most_aesthetic) {
      const match = this.tagging.restaurant_tags.find(
        (rt) => rt.tag_id == photo_xref.tag_id
      )
      match?.photos.push(photo_xref.photo?.url)
    }
  }

  async scanCorpus() {
    await this.tagging.scanCorpus()
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
    const sources = [
      'yelp',
      'ubereats',
      'infatuated',
      'michelin',
      'tripadvisor',
      'doordash',
      'grubhub',
      'google',
    ]
    for (const source of sources) {
      this[source] = await restaurantGetLatestScrape(this.restaurant, source)
    }
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
      scrapeGetData(this.grubhub, 'main.name'),
      tripadvisor_name,
    ])
  }

  mergeTelephone() {
    this.restaurant.telephone = this.merge([
      scrapeGetData(this.yelp, 'data_from_map_search.phone'),
      scrapeGetData(this.ubereats, 'main.phoneNumber'),
      scrapeGetData(this.infatuated, 'data_from_html_embed.phone_number'),
      scrapeGetData(this.tripadvisor, 'overview.contact.phone'),
      scrapeGetData(this.google, 'telephone'),
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
      doordash: this._doorDashRating(),
      grubhub: parseFloat(
        scrapeGetData(this.grubhub, 'main.rating.rating_value')
      ),
      google: parseFloat(scrapeGetData(this.google, 'rating')),
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

  _doorDashRating() {
    const rating = scrapeGetData(this.doordash, 'main.averageRating')
    return rating == 0 ? null : rating
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
      scrapeGetData(this.doordash, 'main.address.printableAddress'),
    ])
  }

  addWebsite() {
    let website = scrapeGetData(this.tripadvisor, 'overview.contact.website')
    website = Base64.decode(website)
    const parts = website.split('_')
    parts.shift()
    parts.pop()
    this.restaurant.website = parts.join('_')

    if (!this.restaurant.website) {
      this.restaurant.website =
        'https://' + scrapeGetData(this.google, 'website')
    }
  }

  addPriceRange() {
    this.restaurant.price_range = scrapeGetData(this.google, 'pricing')

    if (!this.restaurant.price_range?.includes('$')) {
      const text = scrapeGetData(
        this.tripadvisor,
        'overview.detailCard.tagTexts.priceRange.tags[0].tagValue'
      )
      if (text.includes('Low')) this.restaurant.price_range = '$'
      if (text.includes('Mid')) this.restaurant.price_range = '$$'
      if (text.includes('High')) this.restaurant.price_range = '$$$'
    }

    if (!this.restaurant.price_range?.includes('$')) {
      this.restaurant.price_range = scrapeGetData(
        this.yelp,
        'data_from_map_search.priceRange'
      )
    }
  }

  async addHours() {
    this.restaurant.hours = scrapeGetData(
      this.yelp,
      'data_from_html_embed.bizHoursProps.hoursInfoRows',
      []
    )
    let records: string[] = []
    for (const hours of this.restaurant.hours ?? ([] as any)) {
      for (const session of hours.hoursInfo.hours) {
        const times = session.split(' - ')
        const _open = times[0].replace(' ', '')
        const _close = times[1].replace(' ', '')
        const open = this._toPostgresTime(hours.hoursInfo.day, _open)
        const close = this._toPostgresTime(hours.hoursInfo.day, _close)
        const record = `('${this.restaurant.id}'::UUID, timestamp '${open}', timestamp '${close}')`
        records.push(record)
      }
    }
    const query = `
        BEGIN TRANSACTION;
        DELETE FROM opening_hours
          WHERE restaurant_id = '${this.restaurant.id}'::UUID;
        INSERT INTO opening_hours(restaurant_id, hours)
          SELECT id, hours
          FROM  (
             VALUES ${records.join(',')}
             ) t(id, f, t), f_opening_hours_hours(f, t) hours;
        END TRANSACTION;
      `
    const result = await sql(query)
    return result[2].rowCount
  }

  _toPostgresTime(day: string, time: string) {
    const CALIFORNIAN_TZ = '-07'
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const doftw = weekdays.indexOf(day) + 1
    const mDate = moment(`1996 01 ${doftw} ${time}`, 'YYYY MM D hh:mmA')
    const timestamp = mDate.format(`YYYY-MM-DD HH:mm:ss${CALIFORNIAN_TZ}`)
    return timestamp
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

    const json_ue = JSON.parse(
      scrapeGetData(this.ubereats, 'main.metaJson', '"{}"')
    )
    if (json_ue['@id']) {
      // @ts-ignore
      this.restaurant.sources.ubereats = {
        url: json_ue['@id'],
        rating: this.ratings?.ubereats,
      }
    }

    let json_dd = scrapeGetData(this.doordash, 'storeMenuSeo', '"{}"')
    if (json_dd['id']) {
      // @ts-ignore
      this.restaurant.sources.doordash = {
        url: json_dd['id'].split('?')[0],
        rating: this.ratings?.doordash,
      }
    }

    const gh_id = scrapeGetData(this.grubhub, 'main.id')
    if (gh_id) {
      // @ts-ignore
      this.restaurant.sources.grubhub = {
        url: 'https://www.grubhub.com/restaurant/' + gh_id,
        rating: this.ratings?.grubhub,
      }
    }
    this._getGoogleSource()
  }

  _getGoogleSource() {
    if (!this.google) return
    const id = this.google.id_from_source
    const lon = this.restaurant.location.coordinates[0]
    const lat = this.restaurant.location.coordinates[1]
    const source =
      `https://www.google.com/maps/place/` +
      `@${lat},${lon},11z/data=!3m1!4b1!4m5!3m4!1s${id}!8m2!3d${lat}!4d${lon}`
    // @ts-ignore
    this.restaurant.sources.google = {
      url: source,
      rating: this.ratings?.google,
    }
  }

  async mergeImage() {
    let hero = ''
    const yelps = scrapeGetData(
      this.yelp,
      'data_from_html_embed.photoHeaderProps.photoHeaderMedias'
    )
    if (yelps) {
      hero = yelps[0].srcUrl
    }
    const googles = scrapeGetData(this.google, 'hero_image')
    if (googles) {
      hero = googles
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

    if (hero != '') {
      this.restaurant.image = await uploadHeroImage(hero, this.restaurant.id)
    }
  }

  async getUberDishes() {
    if (!this.ubereats?.id) {
      return
    }
    // @ts-ignore
    const raw_dishes = this.ubereats?.data?.dishes
    for (const data of raw_dishes) {
      if (data.title) {
        this.menu_items.push({
          restaurant_id: this.restaurant.id,
          name: data.title,
          description: data.description,
          price: data.price,
          image: data.imageUrl,
        })
      }
    }
  }

  async getDoorDashDishes() {
    if (!this.doordash?.id) {
      return
    }
    // @ts-ignore
    const categories = this.doordash?.data?.menus.currentMenu.menuCategories
    for (const category of categories) {
      for (const data of category.items) {
        if (data.name) {
          this.menu_items.push({
            restaurant_id: this.restaurant.id,
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.imageUrl,
          })
        }
      }
    }
  }

  async getGrubHubDishes() {
    if (!this.grubhub?.id) return
    const categories = scrapeGetData(this.grubhub, 'main.menu_category_list')
    for (const category of categories) {
      for (const data of category.menu_item_list) {
        if (data.name) {
          this.menu_items.push({
            restaurant_id: this.restaurant.id,
            name: data.name,
            description: data.description,
            price: data.price.amount,
          })
        }
      }
    }
  }

  async mergePhotos() {
    // @ts-ignore
    const yelp_data = this.yelp?.data || {}
    // @ts-ignore
    let photos_urls = [
      // ...scrapeGetData(this.tripadvisor, 'photos', []),
      ...this._getGooglePhotos(),
      ...this.getPaginatedData(yelp_data, 'photos').map((i) => i.src),
    ]
    let photos: PhotoXref[] = photos_urls.map((url: string) => {
      return {
        restaurant_id: this.restaurant.id,
        photo: {
          url: url,
        },
      }
    })
    await photoUpsert(photos)
    const most_aesthetic = await bestPhotosForRestaurant(this.restaurant.id)
    this.restaurant.photos = most_aesthetic.map((p) => p.photo?.url)
  }

  _getGooglePhotos() {
    if (!this.google) return []
    const raw = scrapeGetData(this.google, 'photos')
    if (!raw) return []
    const urls = raw.filter((p) => {
      return p.includes('googleusercontent')
    })
    return urls
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
