import '@dish/common'

import { sentryException, sentryMessage } from '@dish/common'
import {
  MenuItem,
  PhotoXref,
  RestaurantWithId,
  globalTagId,
  menuItemsUpsertMerge,
  restaurantUpdate,
  restaurantUpsertManyTags,
} from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import { Base64 } from 'js-base64'
import moment from 'moment'

import {
  bestPhotosForRestaurant,
  bestPhotosForRestaurantTags,
  photoUpsert,
  uploadHeroImage,
} from '../photo-helpers'
import { scrapeGetAllDistinct, scrapeUpdateGeocoderID } from '../scrape-helpers'
import {
  Scrape,
  ScrapeData,
  latestScrapeForRestaurant,
  scrapeGetData,
} from '../scrape-helpers'
import { Tripadvisor } from '../tripadvisor/Tripadvisor'
import {
  DB,
  googlePermalink,
  restaurantCountForCity,
  restaurantFindIDBatchForCity,
  restaurantFindOneWithTagsSQL,
  roughSizeOfObject,
} from '../utils'
import { GPT3 } from './GPT3'
import { checkMaybeDeletePhoto, remove404Images } from './remove_404_images'
import { RestaurantBaseScore } from './RestaurantBaseScore'
import { RestaurantRatings } from './RestaurantRatings'
import { RestaurantTagScores } from './RestaurantTagScores'
import { Tagging } from './Tagging'
import {
  updateAllRestaurantGeocoderIDs,
  updateGeocoderID,
} from './update_all_geocoder_ids'

process.on('unhandledRejection', (reason, promise) => {
  process.exit(1)
})

export class Self extends WorkerJob {
  ALL_SOURCES = [
    'yelp',
    'ubereats',
    'infatuated',
    'michelin',
    'tripadvisor',
    'doordash',
    'grubhub',
    'google',
    'google_review_api',
  ]
  yelp!: Scrape
  ubereats!: Scrape
  infatuated!: Scrape
  michelin!: Scrape
  tripadvisor!: Scrape
  doordash!: Scrape
  grubhub!: Scrape
  google!: Scrape
  google_review_api!: Scrape
  available_sources: string[] = []

  main_db!: DB
  restaurant!: RestaurantWithId
  ratings!: { [key: string]: number }
  _start_time!: [number, number]
  tagging: Tagging
  restaurant_ratings: RestaurantRatings
  restaurant_base_score: RestaurantBaseScore
  restaurant_tag_scores: RestaurantTagScores
  gpt3: GPT3
  menu_items: MenuItem[] = []
  _job_identifier_restaurant_id!: string
  _high_ram_message_sent = false

  _debugRamIntervalFunction!: number

  static queue_config: QueueOptions = {
    limiter: {
      max: 100,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  constructor() {
    super()
    this.tagging = new Tagging(this)
    this.restaurant_ratings = new RestaurantRatings(this)
    this.restaurant_base_score = new RestaurantBaseScore(this)
    this.restaurant_tag_scores = new RestaurantTagScores(this)
    this.gpt3 = new GPT3(this)
  }

  async allForCity(city: string) {
    const PER_PAGE = 1000
    let previous_id = globalTagId
    const total = await restaurantCountForCity(city)
    let count = 0
    while (true) {
      const results = await restaurantFindIDBatchForCity(
        PER_PAGE,
        previous_id,
        city
      )
      if (results.length == 0) {
        break
      }
      for (const result of results) {
        await this.runOnWorker('mergeAll', [result.id])
        count += 1
        const progress = (count / total) * 100
        await this.job.progress(progress)
        previous_id = result.id as string
      }
    }
  }

  async mergeAll(id: string) {
    this._job_identifier_restaurant_id = id
    const restaurant = await restaurantFindOneWithTagsSQL(id)
    console.log(
      '`restaurant.tag` bytes: ' + roughSizeOfObject(restaurant?.tags)
    )
    if (!restaurant) {
      sentryMessage('SELF CRAWLER restaurantFindOneWithTags() null', {
        hasura: global['latestUnhandledGQLessRejection']?.errors[0]?.message,
        mergeAllID: id,
      })
      process.exit(1)
    }
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
        this.addReviewHeadlines,
      ]
      for (const async_func of async_steps) {
        await this._runFailableFunction(async_func)
      }
      await this.postMerge()
    }
    await this.main_db.pool.end()
  }

  async mergeMainData() {
    const steps = [
      this.mergeName,
      this.mergeTelephone,
      this.mergeAddress,
      this.mergeRatings,
      this.addWebsite,
      this.addSources,
      this.noteAvailableSources,
      this.addPriceRange,
      this.getRatingFactors,
    ]
    for (const step of steps) {
      await this._runFailableFunction(step)
    }
  }

  async preMerge(restaurant: RestaurantWithId) {
    this.main_db = DB.main_db()
    this._debugDaemon()
    this.restaurant = restaurant
    console.log('Merging: ' + this.restaurant.name)
    this.resetTimer()
    await this.getScrapeData()
    this.noteAvailableSources()
    this.log('scrapes fetched')
  }

  async postMerge() {
    this.resetTimer()
    if (!this.restaurant.name || this.restaurant.name == '') {
      sentryMessage('SELF CRAWLER: restaurant has no name', {
        restaurant: this.restaurant.id,
      })
      return
    }
    await this.oldestReview()
    await this._runFailableFunction(this.finishTagsEtc)
    await this._runFailableFunction(this.finalScores)
    await restaurantUpdate(this.restaurant)
    clearInterval(this._debugRamIntervalFunction)
    this.log('postMerge()')
    console.log(`Merged: ${this.restaurant.name}`)
  }

  async finishTagsEtc() {
    await restaurantUpdate(this.restaurant, undefined, ['__typename'])
    this.tagging.deDepulicateTags()
    await this.tagging.updateTagRankings()
    await restaurantUpsertManyTags(
      this.restaurant,
      this.tagging.restaurant_tags,
      () => {
        return {}
      },
      ['__typename']
    )
    if (this.menu_items.length != 0) {
      await menuItemsUpsertMerge(this.menu_items)
    }
  }

  async finalScores() {
    await this.restaurant_tag_scores.calculateScores()
    await this.restaurant_base_score.calculateScore()
  }

  noteAvailableSources() {
    this.available_sources = Object.keys(this.restaurant.sources)
  }

  async _runFailableFunction(func: Function) {
    this._start_time = process.hrtime()
    let result = 'success'
    try {
      if (func.constructor.name == 'AsyncFunction') {
        await func.bind(this)()
      } else {
        func.bind(this)()
      }
    } catch (e) {
      result = 'failed'
      sentryException(
        e,
        { function: func.name, restaurant: this.restaurant.name },
        { source: 'Self crawler' }
      )
    }
    this.log(`${func.name} | ${result}`)
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
      if (!match) continue
      if (!match?.photos) match.photos = []
      match?.photos.push(photo_xref.photo?.url)
    }
  }

  async scanCorpus() {
    await this.tagging.scanCorpus()
  }

  async getScrapeData() {
    let at_least_one_scrape = false
    for (const source of this.ALL_SOURCES) {
      const scrape = await latestScrapeForRestaurant(this.restaurant, source)
      if (scrape) at_least_one_scrape = true
      this[source] = scrape
    }
    if (!at_least_one_scrape) {
      throw new Error('No scrapes found for restaurant')
    }
  }

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
    const names = [
      scrapeGetData(this.yelp, 'data_from_map_search.name'),
      scrapeGetData(this.ubereats, 'main.title'),
      scrapeGetData(this.infatuated, 'data_from_map_search.name'),
      scrapeGetData(this.michelin, 'main.name'),
      scrapeGetData(this.grubhub, 'main.name'),
      scrapeGetData(this.doordash, 'main.name'),
      tripadvisor_name,
    ]
    this.restaurant.name = this.merge(names)
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
    this.restaurant_ratings.mergeRatings()
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
    let hoursData = (this.restaurant.hours = scrapeGetData(
      this.yelp,
      'data_from_html_embed.bizHoursProps.hoursInfoRows',
      []
    ))
    let records: string[] = []
    for (const hours of hoursData ?? ([] as any)) {
      for (const session of hours.hoursInfo.hours) {
        const times = session.split(' - ')
        if (!times || times.length == 0) continue
        const _open = times[0].replace(' ', '')
        const _close = times[1].replace(' ', '')
        const open = this._toPostgresTime(hours.hoursInfo.day, _open)
        const close = this._toPostgresTime(hours.hoursInfo.day, _close)
        const record = `('${this.restaurant.id}'::UUID, timestamp '${open}', timestamp '${close}')`
        records.push(record)
      }
    }
    if (records.length == 0) return 0
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
    const result = await this.main_db.query(query)
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

  async oldestReview() {
    const query = `
      SELECT MIN(authored_at) oldest_review
      FROM review
        WHERE restaurant_id = '${this.restaurant.id}'
      ORDER BY oldest_review DESC
    `
    const result = await this.main_db.query(query)
    const oldest_review = result.rows[0].oldest_review
    this.restaurant.oldest_review_date = oldest_review
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
    if (!this.google_review_api) return
    const id = this.google_review_api.id_from_source
    const lon = this.restaurant.location.coordinates[0]
    const lat = this.restaurant.location.coordinates[1]
    const source = googlePermalink(id, lat, lon)
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
      this.restaurant.image = (await uploadHeroImage(hero, this.restaurant.id))!
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
        } as MenuItem)
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
          } as MenuItem)
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
          } as MenuItem)
        }
      }
    }
  }

  async mergePhotos() {
    // @ts-ignore
    const yelp_data = this.yelp?.data || {}
    // @ts-ignore
    let photos_urls = [
      ...scrapeGetData(this.tripadvisor, 'photos', []),
      ...this._getGooglePhotos(),
      ...this.getPaginatedData(yelp_data, 'photos').map((i) => i.src),
    ]
    let photos: PhotoXref[] = photos_urls.map((url: string) => {
      return {
        restaurant_id: this.restaurant.id,
        photo: {
          url: url,
        },
      } as PhotoXref
    })
    await photoUpsert(photos)
    const most_aesthetic =
      (await bestPhotosForRestaurant(this.restaurant.id)) || []
    //@ts-ignore
    this.restaurant.photos = most_aesthetic.map((p) => p.photo?.url)
  }

  _getGooglePhotos() {
    let urls: string[] = []
    if (!this.google_review_api) return []
    const reviews = scrapeGetData(this.google_review_api, 'reviews')
    if (!reviews) return []
    for (const review of reviews) {
      urls = [...urls, ...review.photos]
    }
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

  async addReviewHeadlines() {
    const id = this.restaurant.id
    const result = await this.main_db.query(`
      SELECT DISTINCT(sentence), naive_sentiment FROM restaurant
        JOIN review ON review.restaurant_id = restaurant.id
        JOIN review_tag_sentence rts ON rts.review_id = review.id
      WHERE restaurant.id = '${id}'
      ORDER BY naive_sentiment DESC
      LIMIT 5
    `)
    this.restaurant.headlines = result.rows
  }

  async updateAllGeocoderIDs() {
    await updateAllRestaurantGeocoderIDs(this)
  }

  async updateAllDistinctScrapeGeocoderIDs() {
    const all = await scrapeGetAllDistinct()
    for (const scrape of all) {
      await this.runOnWorker('updateScrapeGeocoderID', [scrape.scrape_id])
    }
  }

  async updateScrapeGeocoderID(scrape_id: string) {
    await scrapeUpdateGeocoderID(scrape_id)
  }

  async updateGeocoderID(restaurant: RestaurantWithId) {
    await updateGeocoderID(restaurant)
  }

  async remove404Images() {
    await remove404Images(this)
  }

  async checkMaybeDeletePhoto(photo_id: string, url: string) {
    await checkMaybeDeletePhoto(photo_id, url)
  }

  async generateGPT3Summary(id: string) {
    this._job_identifier_restaurant_id = id
    const restaurant = await restaurantFindOneWithTagsSQL(id)
    if (restaurant) {
      this.main_db = DB.main_db()
      this.restaurant = restaurant
      await this.gpt3.generateGPT3Summary()
      await restaurantUpdate(this.restaurant)
      await this.main_db.pool.end()
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

  log(message: string) {
    if (process.env.DISH_DEBUG != '1') return
    const time = this.elapsedTime() + 's'
    const memory =
      Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'Mb'
    const restaurant = this.restaurant?.name || '...'
    console.log(`${restaurant}: ${message} | ${time} | ${memory}`)
  }

  _debugDaemon() {
    const fn = () => {
      this._checkRAM()
      this._checkNulls()
    }
    this._debugRamIntervalFunction = setInterval(fn, 5000)
  }

  _checkRAM(marker?: string) {
    const ram_value = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    const ram = ram_value + 'Mb'
    const limit = 5000
    if (ram_value > limit && !this._high_ram_message_sent) {
      sentryMessage(`Worker RAM over ${limit}Mb`, {
        ram,
        restaurant: this.restaurant,
      })
      this._high_ram_message_sent = true
    }
    marker = marker ? `(${marker})` : ''
    this.log(`Worker RAM usage ${marker}: ${ram}`)
  }

  _checkNulls() {
    if (!this.restaurant || !this.restaurant.slug || !this.restaurant.name) {
      sentryMessage('Self crawl null data', {
        restaurant_id: this._job_identifier_restaurant_id,
      })
      process.exit(1)
    }
  }
}
