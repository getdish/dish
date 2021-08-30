import '@dish/common'

import { sentryMessage } from '@dish/common'
import {
  MenuItem,
  PhotoXref,
  RestaurantWithId,
  globalTagId,
  menuItemsUpsertMerge,
  restaurantUpdate,
  restaurantUpsertManyTags,
  tagUpsert,
} from '@dish/graph'
import { Database } from '@dish/helpers-node'
import { DEBUG_LEVEL, WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import { Base64 } from 'js-base64'
import moment from 'moment'

import { DISH_DEBUG } from '../constants'
import {
  DoorDashScrapeData,
  GoogleReviewScrapeData,
  GoogleScrapeData,
  TripAdvisorScrapeData,
  UberEatsScrapeData,
} from '../fixtures/fixtures'
import {
  bestPhotosForRestaurant,
  bestPhotosForRestaurantTags,
  photoUpsert,
  uploadHeroImage,
} from '../photo-helpers'
import {
  Scrape,
  latestScrapeForRestaurant,
  scrapeGetAllDistinct,
  scrapeGetData,
  scrapeUpdateGeocoderID,
} from '../scrape-helpers'
import { Tripadvisor } from '../tripadvisor/Tripadvisor'
import {
  googlePermalink,
  restaurantCountForCity,
  restaurantFindIDBatchForCity,
  restaurantFindOneWithTagsSQL,
  roughSizeOfObject,
} from '../utils'
import { YelpScrape } from '../yelp/Yelp'
import { GPT3 } from './GPT3'
import { checkMaybeDeletePhoto, remove404Images } from './remove_404_images'
import { RestaurantBaseScore } from './RestaurantBaseScore'
import { RestaurantRatings } from './RestaurantRatings'
import { RestaurantTagScores } from './RestaurantTagScores'
import { GEM_UIID, Tagging } from './Tagging'
import { updateAllRestaurantGeocoderIDs, updateGeocoderID } from './update_all_geocoder_ids'

process.on('unhandledRejection', (reason, _) => {
  console.log('unhandled rejection', reason)
  process.exit(1)
})

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
type Day = typeof weekdays[number]

const toPostgresTime = (day: Day, time: string) => {
  const CALIFORNIAN_TZ = '-07'
  const doftw = weekdays.indexOf(day) + 1
  const mDate = moment(`1996 01 ${doftw} ${time}`, 'YYYY MM D hh:mmA')
  const timestamp = mDate.format(`YYYY-MM-DD HH:mm:ss${CALIFORNIAN_TZ}`)
  return timestamp
}

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
  yelp: YelpScrape | null = null
  ubereats: Scrape<UberEatsScrapeData> | null = null
  infatuated: Scrape | null = null
  michelin: Scrape | null = null
  tripadvisor: Scrape<TripAdvisorScrapeData> | null = null
  doordash: Scrape<DoorDashScrapeData> | null = null
  grubhub: Scrape | null = null
  google: Scrape<GoogleScrapeData> | null = null
  google_review_api: Scrape<GoogleReviewScrapeData> | null = null
  available_sources: string[] = []

  main_db!: Database
  restaurant!: RestaurantWithId
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
      max: 10,
      duration: 5000,
    },
  }

  static job_config: JobOptions = {
    attempts: 2,
  }

  get logName() {
    return `Self - ${this.restaurant?.name || '...'}`
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
    const PER_PAGE = 30
    let previous_id = globalTagId
    const total = await restaurantCountForCity(city)
    let count = 0
    while (true) {
      const results = await restaurantFindIDBatchForCity(PER_PAGE, previous_id, city)
      if (results.length == 0) {
        break
      }
      await Promise.all(
        results.map(async (result) => {
          // avoid a ton of jobs by checking for scrapes first
          const anyScrape = await Promise.all(
            this.ALL_SOURCES.map(async (source) => {
              return await latestScrapeForRestaurant(result, source)
            })
          )
          if (anyScrape.some(Boolean)) {
            await this.runOnWorker('mergeAll', [result.id])
          }
        })
      )
      count += results.length
      const progress = (count / total) * 100
      await this.job.progress(progress)
      previous_id = results[results.length - 1].id
    }
  }

  async mergeAll(id: string) {
    this._job_identifier_restaurant_id = id
    const restaurant = await restaurantFindOneWithTagsSQL(id)
    this.log('`restaurant.tag` bytes: ' + roughSizeOfObject(restaurant?.tags))
    if (!restaurant) {
      sentryMessage('SELF CRAWLER restaurantFindOneWithTags() null', {
        data: {
          mergeAllID: id,
        },
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
        this.generateSummary,
      ]
      for (const async_func of async_steps) {
        this.log('running step', async_func.name)
        await this._runFailableFunction(async_func)
      }
      await this.postMerge()
      this.log('done with restaurant', id)
    }
  }

  async getScrapeData() {
    let at_least_one = false
    for (const source of this.ALL_SOURCES) {
      const scrape = await latestScrapeForRestaurant(this.restaurant, source)
      if (scrape) {
        at_least_one = true
        if (DISH_DEBUG > 1) {
          this.log(`Found scrape for ${source} with data`, scrape?.data)
        }
      }
      this[source] = scrape
    }
    if (!at_least_one) {
      throw new Error('No scrapes found for restaurant')
    }
  }

  async mergeMainData() {
    const steps = [
      this.mergeName,
      this.mergeTelephone,
      this.mergeAddress,
      this.addWebsite,
      this.addSourceOgIds,
      this.addSources,
      this.noteAvailableSources,
      this.addPriceRange,
      this.getRatingFactors,
    ]
    for (const step of steps) {
      await this._runFailableFunction(step)
    }
  }

  async seed() {
    await tagUpsert([
      {
        name: 'Gem',
        slug: 'lenses__gems',
        alternates: ['notable'],
        type: 'lense',
        id: GEM_UIID,
      },
      {
        name: 'Unique',
        slug: 'lenses__unique',
        type: 'lense',
      },
    ])
  }

  async preMerge(restaurant: RestaurantWithId) {
    await this.seed()
    this.main_db = Database.main_db
    this._debugDaemon()
    this.restaurant = restaurant
    this.log('Merging: ' + this.restaurant.name)
    this.resetTimer()
    await this.getScrapeData()
    this.noteAvailableSources()
  }

  async postMerge() {
    this.resetTimer()
    if (!this.restaurant.name || this.restaurant.name == '') {
      sentryMessage('SELF CRAWLER: restaurant has no name', {
        data: {
          restaurant: this.restaurant.id,
        },
      })
      return
    }
    await this.oldestReview()
    await this._runFailableFunction(this.finishTagsEtc)
    await this._runFailableFunction(this.finalScores)
    this.log('merging final restaurant')
    await restaurantUpdate(this.restaurant)
    clearInterval(this._debugRamIntervalFunction)
    this.log(`Merged: ${this.restaurant.name}`)
  }

  async finishTagsEtc() {
    this.log('Finishing tags...')
    await restaurantUpdate(this.restaurant, { keys: ['__typename'] })
    this.tagging.deDepulicateTags()
    this.log('Updating rankings...')
    await this.tagging.updateTagRankings()
    this.log('Upsert tags...')
    await restaurantUpsertManyTags(this.restaurant, this.tagging.restaurant_tags, {
      select: () => ({}),
      keys: ['__typename'],
    })
    this.log('Menu items merge...')
    if (this.menu_items.length != 0) {
      await menuItemsUpsertMerge(this.menu_items)
    }
  }

  async finalScores() {
    this.log('Final scores calculation...')
    await this.restaurant_tag_scores.calculateScores()
    await this.restaurant_base_score.calculateScore()
  }

  noteAvailableSources() {
    this.available_sources = Object.keys(this.restaurant.sources || {})
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
    const all = await this.tagging.findPhotosForTags()
    await photoUpsert(all)
    const most_aesthetic = await bestPhotosForRestaurantTags(this.restaurant.id)
    for (const photo_xref of most_aesthetic) {
      const match = this.tagging.restaurant_tags.find((rt) => rt.tag_id == photo_xref.tag_id)
      if (!match) continue
      if (!match?.photos) match.photos = []
      match?.photos.push(photo_xref.photo?.url)
    }
  }

  async scanCorpus() {
    await this.tagging.scanCorpus()
  }

  merge(strings: string[]) {
    const filledIn = strings.filter((x) => x?.length > 0)
    let overlaps: string[] = []
    for (let pair of Self.allPairs(filledIn)) {
      const overlap = Self.findOverlap(pair[0], pair[1])
      if (overlap) {
        overlaps.push(overlap)
      }
    }
    const shortest_string = Self.shortestString(filledIn)
    const shortest_overlap = Self.shortestString(overlaps)
    if (shortest_overlap.length) {
      return shortest_overlap
    } else {
      if (shortest_string.length === 0) {
        return null
      }
      return shortest_string
    }
  }

  mergeName() {
    const names = [
      scrapeGetData(this.yelp, (x) => x.json.name),
      scrapeGetData(this.ubereats, (x) => x.main.title),
      scrapeGetData(this.infatuated, (x) => x.data_from_search_list_item.name),
      scrapeGetData(this.michelin, (x) => x.main.name),
      scrapeGetData(this.grubhub, (x) => x.main.name),
      scrapeGetData(this.doordash, (x) => x.main.title),
      Tripadvisor.cleanName(scrapeGetData(this.tripadvisor, (x) => x.overview.name)),
    ]
    const name = this.merge(names)
    if (name) {
      this.restaurant.name = name
    }
    if (DISH_DEBUG) {
      this.log('found names', names, 'chose', name)
      if (!name) {
        console.log('no name?', '\n', this.yelp?.data)
      }
    }
  }

  mergeTelephone() {
    this.restaurant.telephone = this.merge([
      scrapeGetData(this.yelp, (x) => x.json.telephone),
      scrapeGetData(this.ubereats, (x) => x.main.phoneNumber),
      scrapeGetData(this.infatuated, (x) => x.data_from_html_embed.phone_number),
      scrapeGetData(this.tripadvisor, (x) => x.overview.contact.phone),
      scrapeGetData(this.google, (x) => x.telephone),
    ])
  }

  mergeAddress() {
    const addresses = [
      scrapeGetData(
        this.yelp,
        (x) =>
          [
            x.json.address.streetAddress,
            x.json.address.addressLocality,
            x.json.address.addressRegion,
            x.json.address.postalCode,
            // x.json.address.addressCountry,
          ]
            .filter(Boolean)
            .join(', '),
        ['']
      ),
      scrapeGetData(this.ubereats, (x) => x.main.location.address),
      scrapeGetData(this.infatuated, (x) => x.data_from_search_list_item.street),
      scrapeGetData(this.michelin, (x) => x.main.title),
      scrapeGetData(this.tripadvisor, (x) => x.overview.contact.address),
      scrapeGetData(this.doordash, (x) => x.main.location.address),
    ]
    this.restaurant.address = this.merge(addresses)
    if (DISH_DEBUG) {
      this.log('found addresses', addresses, 'chose', this.restaurant.address)
    }
  }

  addWebsite() {
    let website = scrapeGetData(this.tripadvisor, (x) => x.overview.contact.website)
    website = Base64.decode(website)
    const parts = website.split('_')
    parts.shift()
    parts.pop()
    this.restaurant.website = parts.join('_')

    if (!this.restaurant.website) {
      this.restaurant.website = 'https://' + scrapeGetData(this.google, (x) => x.website)
    }
  }

  addPriceRange() {
    this.restaurant.price_range = scrapeGetData(this.google, (x) => x.pricing)

    if (!this.restaurant.price_range?.includes('$')) {
      const text = scrapeGetData(
        this.tripadvisor,
        (x) => x.overview.detailCard.tagTexts.priceRange.tags[0].tagValue
      )
      if (text.includes('Low')) this.restaurant.price_range = '$'
      if (text.includes('Mid')) this.restaurant.price_range = '$$'
      if (text.includes('High')) this.restaurant.price_range = '$$$'
    }

    if (!this.restaurant.price_range?.includes('$')) {
      this.restaurant.price_range = scrapeGetData(
        this.yelp,
        (x) => x.data_from_search_list_item.priceRange
      )
    }
  }

  async addHours() {
    this.restaurant.hours = scrapeGetData(
      this.yelp,
      (x) => x.dynamic.legacyProps.props.moreInfoProps.bizInfo.bizHours,
      []
    )

    const dayRange = this.restaurant.hours

    // flatten
    const dayData = dayRange.flatMap((dr: any) => {
      if (dr.formattedDate.includes('-')) {
        // explode from range Mon-Wed into individual days Mon, Tue, Wed
        const [start, end] = dr.formattedDate.split('-')
        const startI = weekdays.indexOf(start as any)
        let endI = weekdays.indexOf(end as any)
        if (endI < startI) {
          endI = startI + endI
        }
        const days: Day[] = []
        for (let i = startI; i <= endI; i++) {
          days.push(weekdays[i % weekdays.length])
        }
        return days.map((day) => ({
          formattedDate: day as Day,
          formattedTime: dr.formattedTime,
        }))
      }
      return {
        formattedDate: dr.formattedDate as Day,
        formattedTime: dr.formattedTime,
      }
    })

    const records: string[] = []
    for (const day of dayData) {
      const times = day.formattedTime.split(' - ')
      if (!times || !times.length) continue
      let [openTime, closeTime] = times.map((x: any) => x.replace(' ', '').trim().toLowerCase())
      const openDay = day.formattedDate
      let closeDay = day.formattedDate
      // if closes in the next day, move the close day up one
      const closesInMorningFromPM = openTime.includes('pm') && closeTime.includes('am')
      const closesInMorningFromAM =
        openTime.includes('am') &&
        closeTime.includes('am') &&
        // basically if its 8:00am - 11:00am, its closing in the same day
        // but if its 8:00am - 2:00am, its closing the next morning
        // both are am and openTime > closeTime
        +openTime.split(':')[0] > +closeTime.split(':')[0]

      if (closesInMorningFromAM || closesInMorningFromPM) {
        const curIndex = weekdays.indexOf(closeDay)
        closeDay = weekdays[(curIndex + 1) % weekdays.length]
      }

      const open = toPostgresTime(openDay, openTime)
      const close = toPostgresTime(closeDay, closeTime)

      if ([open, close].some((x) => x === 'Invalid date')) {
        // prettier-ignore
        console.log('⚠️ WARN: Invalid date parsed', { open, openDay, openTime, close, closeDay, closeTime })
        console.log('   ...', { hours: this.restaurant.hours, dayData })
        continue
      }

      records.push(`('${this.restaurant.id}'::UUID, timestamp '${open}', timestamp '${close}')`)
    }

    if (records.length == 0) {
      return {
        count: 0,
        records,
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

    try {
      const result = await this.main_db.query(query)
      return {
        count: result[2].rowCount,
        records,
      }
    } catch (err) {
      console.error('Error setting hours', err.message, err.stack)
      console.log('Hours records:', records.join(','))
    }
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

  // used for doing easier re-crawls of specific restaurants
  // can be useful in future for tracking changed names, address, etc
  addSourceOgIds() {
    this.restaurant.og_source_ids = {
      ...(this.restaurant.og_source_ids || null),
    }
    const sources = [
      this.tripadvisor,
      this.michelin,
      this.infatuated,
      this.yelp,
      this.doordash,
      this.grubhub,
      this.ubereats,
      this.google_review_api,
    ]
    for (const source of sources) {
      if (source) {
        this.restaurant.og_source_ids[source.source] = source.id_from_source
      }
    }
  }

  addSources() {
    let url: string
    let path: string
    let parts: string[]

    this.restaurant.sources = {
      ...this.restaurant.sources,
    } as Record<string, { url: string; rating: number }>

    const { rating, ratings } = this.restaurant_ratings.getRatings()

    this.restaurant.rating = rating

    path = scrapeGetData(this.tripadvisor, (x) => x.overview.links.warUrl)
    if (path != '') {
      parts = path.split('-')
      parts.shift()
      url = 'https://www.tripadvisor.com/' + parts.join('-')
      this.restaurant.sources.tripadvisor = {
        url,
        rating: ratings?.tripadvisor,
      }
    }

    path = scrapeGetData(this.yelp, (x) => x.data_from_search_list_item.businessUrl)
    this.log('ratings', ratings)
    if (path != '') {
      this.restaurant.sources.yelp = {
        url: 'https://www.yelp.com' + path,
        rating: ratings?.yelp,
      }
    }

    path = scrapeGetData(this.infatuated, (x) => x.data_from_search_list_item.post.review_link)
    if (path != '') {
      this.restaurant.sources.infatuated = {
        url: 'https://www.theinfatuation.com' + path,
        rating: ratings?.infatuated,
      }
    }

    path = scrapeGetData(this.michelin, (x) => x.main.url)
    if (path != '') {
      this.restaurant.sources.michelin = {
        url: 'https://guide.michelin.com' + path,
        rating: ratings?.michelin,
      }
    }

    let json_ue = scrapeGetData(this.ubereats, (x) => x.main.metaJson, {})
    if (typeof json_ue === 'string') {
      try {
        json_ue = JSON.parse(json_ue)
      } catch (err) {
        console.log('error parsing uber', err)
      }
    }
    if (json_ue['@id']) {
      this.restaurant.sources.ubereats = {
        url: json_ue['@id'],
        rating: ratings?.ubereats,
      }
    }

    let json_dd = scrapeGetData(this.doordash, (x) => x.storeMenuSeo, {})
    if (json_dd['id']) {
      this.restaurant.sources.doordash = {
        url: json_dd['id'].split('?')[0],
        rating: ratings?.doordash,
      }
    }

    const gh_id = scrapeGetData(this.grubhub, (x) => x.main.id)
    if (gh_id) {
      this.restaurant.sources.grubhub = {
        url: 'https://www.grubhub.com/restaurant/' + gh_id,
        rating: ratings?.grubhub,
      }
    }

    if (!this.google_review_api) return
    this.log('addSources getGoogleSource')
    const id = this.google_review_api.id_from_source
    const lon = this.restaurant.location.coordinates[0]
    const lat = this.restaurant.location.coordinates[1]
    const source = googlePermalink(id, lat, lon)
    // @ts-ignore
    this.restaurant.sources.google = {
      url: source,
      rating: ratings?.google,
    }
  }

  async mergeImage() {
    let hero = ''
    // top to bottom is least preferred hero to most preferred
    const yelps = scrapeGetData(
      this.yelp,
      (x) =>
        x.json.image?.replace('348s.jpg', '1000s.jpg') ??
        console.error('no image! we could get from dynamic', x.json)
    )
    if (yelps) {
      hero = yelps
    }
    const googles = scrapeGetData(this.google, (x) => x.hero_image)
    if (googles) {
      hero = googles
    }
    const infatuateds = scrapeGetData(
      this.infatuated,
      (x) => x.data_from_search_list_item.post.venue_image
    )
    if (infatuateds) {
      hero = infatuateds
    }
    const michelins = scrapeGetData(this.michelin, (x) => x.main.image)
    if (michelins) {
      hero = michelins
    }
    if (hero != '') {
      const uploaded = await uploadHeroImage(hero, this.restaurant.id)
      if (uploaded) {
        this.restaurant.image = uploaded
      }
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
    const categories = scrapeGetData(this.grubhub, (x) => x.main.menu_category_list)
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
    const yelp_data = this.yelp?.data
    let urls: string[] = [
      ...scrapeGetData(this.tripadvisor, (x) => x.photos, []),
      ...this._getGooglePhotos(),
      ...(yelp_data ? this.getPaginatedData(yelp_data.photos)?.map((i) => i.url) : []),
    ]
    let photos: PhotoXref[] = urls.map((url) => {
      return {
        restaurant_id: this.restaurant.id,
        photo: {
          url,
        },
      } as PhotoXref
    })
    this.log(`mergePhotos ${photos.length} photos`)
    await photoUpsert(photos)
    const most_aesthetic = (await bestPhotosForRestaurant(this.restaurant.id)) || []
    this.restaurant.photos = most_aesthetic.map((p) => p.photo?.url)
  }

  _getGooglePhotos() {
    let urls: string[] = []
    if (!this.google_review_api) return []
    const reviews = scrapeGetData(this.google_review_api, (x) => x.reviews)
    if (!reviews) return []
    for (const review of reviews) {
      urls = [...urls, ...review.photos]
    }
    return urls
  }

  getPaginatedData<A extends any>(data: { [key: string]: A[] } | null): A[] {
    if (!data) return []
    return Object.keys(data).flatMap((key) => data[key])
  }

  getPaginatedDataNumberedKeys(data: any, type: 'photos' | 'reviews') {
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
    const factors = scrapeGetData(this.tripadvisor, (x) => x.overview.rating.ratingQuestions, [])
    this.restaurant.rating_factors = {
      food: (factors.find((i) => i.name == 'Food')?.rating ?? 0) / 10,
      service: (factors.find((i) => i.name == 'Service')?.rating ?? 0) / 10,
      value: (factors.find((i) => i.name == 'Value')?.rating ?? 0) / 10,
      ambience: (factors.find((i) => i.name == 'Atmosphere')?.rating ?? 0) / 10,
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

  async generateSummary() {
    if (process.env.NODE_ENV === 'test') {
      return
    }
    if (!this.restaurant.scrape_metadata?.gpt_summary_updated_at) {
      await this.gpt3.generateGPT3Summary()
      this.restaurant.scrape_metadata = {
        ...this.restaurant.scrape_metadata,
        gpt_summary_updated_at: Date.now(),
      }
      try {
        await restaurantUpdate(this.restaurant)
      } catch (err) {
        console.log('error generateSummary', err.message, err.stack)
        console.log('err restaurant', this.restaurant)
      }
    }
  }

  async generateGPT3Summary(id: string) {
    this._job_identifier_restaurant_id = id
    const restaurant = await restaurantFindOneWithTagsSQL(id)
    if (restaurant) {
      this.main_db = Database.main_db
      this.restaurant = restaurant
      await this.gpt3.generateGPT3Summary()
      await restaurantUpdate(this.restaurant)
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

  _debugDaemon() {
    const fn = () => {
      this._checkRAM()
      this._checkNulls()
    }
    // @ts-ignore
    this._debugRamIntervalFunction = setInterval(fn, 10000)
  }

  _checkRAM(marker?: string) {
    if (DEBUG_LEVEL < 2) {
      return
    }
    const ram_value = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    const ram = ram_value + 'Mb'
    const limit = 5000
    if (ram_value > limit && !this._high_ram_message_sent) {
      sentryMessage(`Worker RAM over ${limit}Mb`, {
        data: {
          ram,
          restaurant: this.restaurant,
        },
      })
      this._high_ram_message_sent = true
    }
    marker = marker ? `(${marker})` : ''
    this.log(`Worker RAM usage ${marker}: ${ram}`)
  }

  _checkNulls() {
    if (!this.restaurant || !this.restaurant.slug || !this.restaurant.name) {
      sentryMessage('Self crawl null data', {
        data: {
          restaurant_id: this._job_identifier_restaurant_id,
        },
      })
      process.exit(1)
    }
  }
}
