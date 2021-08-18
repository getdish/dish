import '@dish/common'

import { restaurantFindOne, restaurantUpdate } from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import * as acorn from 'acorn'
import axios from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import * as cheerio from 'cheerio'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { GoogleGeocoder } from '../google/GoogleGeocoder'
import { Puppeteer } from '../Puppeteer'
import { ScrapeData, scrapeFindOneByUUID, scrapeInsert, scrapeMergeData } from '../scrape-helpers'
import { aroundCoords, decodeEntities, geocode } from '../utils'

const TRIPADVISOR_DOMAIN = 'https://www.tripadvisor.com/'
const TRIPADVISOR_PROXY = process.env.TRIPADVISOR_PROXY || TRIPADVISOR_DOMAIN
const AXIOS_HEADERS = {
  'X-Requested-With': 'XMLHttpRequest',
  'X-My-X-Forwarded-For': 'www.tripadvisor.com',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
  'Accept-Language': 'en-GB,en;q=0.5',
  'accept-encoding': 'deflate, gzip, zstd',
}

const removeStartSlash = (x: string) => (x.startsWith('/') ? x.slice(1) : x)

export class Tripadvisor extends WorkerJob {
  public scrape_id!: string
  public MAPVIEW_SIZE = 1000
  public SEARCH_RADIUS_MULTIPLIER = 10
  public _TESTS__LIMIT_GEO_SEARCH = false
  public detail_id!: string

  static queue_config: QueueOptions = {
    limiter: {
      max: 5,
      duration: 2000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  get logName() {
    return `Tripadvisor`
  }

  async allForCity(city_name: string) {
    this.log('Starting crawler. Using domain: ' + TRIPADVISOR_DOMAIN)
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(
      aroundCoords(coords[0], coords[1], this.MAPVIEW_SIZE, this.SEARCH_RADIUS_MULTIPLIER)
    )
    for (const coords of region_coords) {
      await this.runOnWorker('getRestaurants', [coords[0], coords[1], 0])
    }
  }

  async getRestaurants(lat: number, lon: number) {
    const base =
      'GMapsLocationController?' +
      'Action=update&from=Restaurants&g=1&mapProviderFeature=ta-maps-gmaps3&validDates=false' +
      '&pinSel=v2&finalRequest=false&includeMeta=false&trackPageView=false'
    const dimensions = `&mz=17&mw=${this.MAPVIEW_SIZE}&mh=${this.MAPVIEW_SIZE}`
    const coords = `&mc=${lat},${lon}`
    const uri = TRIPADVISOR_PROXY + base + dimensions + coords
    const response = await axios.get(uri, {
      headers: AXIOS_HEADERS,
    })
    const data = response.data
    if (!data?.restaurants) {
      throw new Error(
        `error, fail: no restaurants in response via uri ${uri}\n:${JSON.stringify(
          response || null
        )}`
      )
    }

    for (const item of data.restaurants) {
      await this.runOnWorker('getRestaurant', [removeStartSlash(item.url)])
      if (this._TESTS__LIMIT_GEO_SEARCH) break
    }
  }

  async getRestaurant(path: string) {
    this.detail_id = this.extractDetailID(path)
    const pup = new Puppeteer(TRIPADVISOR_DOMAIN, process.env.TRIPADVISOR_PROXY)
    await pup.boot()
    const restaurantUrl = TRIPADVISOR_DOMAIN + removeStartSlash(path)
    this.log(`Loading url`, restaurantUrl)
    await pup.page.goto(restaurantUrl, {
      timeout: 15_000,
      waitUntil: 'networkidle0',
    })
    this.log(`Got html response`)
    const content = await pup.page.content()
    let data = this._extractEmbeddedJSONData(content)
    const scrape_id = await this.saveRestaurant(data)
    this.log(`Saved restaurant data`)
    if (!scrape_id) return
    await this.savePhotos(scrape_id)
    this.log(`Saved photos`)
    await this.saveReviews(scrape_id, 0, pup)
    this.log(`Saved reviews`)
  }

  async saveRestaurant(data: ScrapeData) {
    const overview = this._getOverview(data)
    const menu = this._getMenu(data)
    this.log('saving ' + overview.name)
    const id_from_source = overview.detailId.toString()
    const lon = overview.location.longitude
    const lat = overview.location.latitude
    const restaurant_name = Tripadvisor.cleanName(overview.name)
    const restaurant_id = await restaurantSaveCanonical(
      'tripadvisor',
      id_from_source,
      lon,
      lat,
      restaurant_name,
      overview.contact.address
    )
    this.log('found canonical restaurant ID: ' + restaurant_id)
    const id = await scrapeInsert({
      source: 'tripadvisor',
      restaurant_id,
      id_from_source,
      location: {
        lon: lon,
        lat: lat,
      },
      data: {
        overview: overview,
        menu: menu,
      },
    })
    return id
  }

  static getNameAndAddress(scrape: ScrapeData) {
    return {
      name: Tripadvisor.cleanName(scrape.data.overview.name),
      address: scrape.data.overview.contact.address,
    }
  }

  // parallelism is overcomplicating, so i turned it off here
  async saveReviews(scrape_id: string, pageNum: number, pup: Puppeteer) {
    const page = pup.page
    if (process.env.NODE_ENV == 'test' && pageNum > 1) {
      console.log('TEST MODE, finishing past page 1')
      return
    }
    const scrape = await scrapeFindOneByUUID(scrape_id)
    if (!scrape) {
      throw new Error(`No scrape`)
    }
    // click on more... if any exist, this actually expands every review for us:
    try {
      await page.click('.review-container .partial_entry .taLnk')
    } catch (err) {
      console.log('no More..., may be ok', err.message)
    }

    const data = await (async () => {
      try {
        // if mobile, open it up first
        await page.click('.see-more-mobile')
      } catch {
        // ok
      }
      const reviews = await page.$$('.reviewSelector')
      if (!reviews) {
        throw new Error('no review selector')
      }
      const data: ScrapeData[] = []
      for (const review of reviews) {
        const [uid, username, quote, date, text, rating] = await Promise.all([
          review.$eval('.memberOverlayLink', (x) => (x.id || '').replace('UID_', '')),
          review.$eval('.memberInfoColumn .info_text', (x) => x.textContent),
          review.$eval('.quote .noQuotes', (x) => x.textContent),
          review.$eval('.ratingDate', (x) => x.getAttribute('title')),
          review.$eval('.partial_entry', (x) => x.textContent),
          review
            .$eval('.ui_bubble_rating', (x) =>
              getComputedStyle(x, '::after').getPropertyValue('content')
            )
            .then((after) => {
              // 4 stars = \e00b\e00b\e00b\e00b\e00d
              return after
                ? after.split('e00').reduce((rating, part) => rating + (part === 'b' ? 1 : 0), 0)
                : ''
            }),
        ] as const)
        data.push({
          uid,
          // TODO: Get actual internal username
          username,
          quote,
          date,
          text: (text || '').replace('Show less', '').trim(),
          rating,
        })
      }
      if (!data.length) {
        return null
      }
      return data
    })()

    // merge
    if (data) {
      this.log(`Merging reviews (page ${pageNum}, reviews ${data.length})`)
      await scrapeMergeData(scrape_id, {
        reviews: {
          ...(scrape.data.reviews || null),
          ['dishpage-' + page]: data,
        },
      })
    }

    const nextButton = await page.$('.nav.next.ui_button.primary')
    if (!nextButton) return
    const href = await (
      await page.evaluateHandle((x) => x.getAttribute('href'), nextButton)
    ).jsonValue()
    if (href === null) {
      console.log('no more reviews')
      return
    }
    if (typeof href !== 'string') {
      console.error(`non-string href`, href)
      return
    }
    this.log(`Loading next page ${href}`)
    // await pup.close()
    // const next = new Puppeteer(TRIPADVISOR_DOMAIN, process.env.TRIPADVISOR_PROXY)
    // await next.boot()
    await pup.page.goto(TRIPADVISOR_DOMAIN + removeStartSlash(href), {
      timeout: 15_000,
      waitUntil: 'networkidle0',
    })
    await this.saveReviews(scrape_id, pageNum + 1, pup)
  }

  async savePhotos(scrape_id: string) {
    let page = 0
    let photos: any[] = []
    while (true) {
      const result = await this.parsePhotoPage(page)
      if (!result) break
      const batch = result
      photos = [...photos, ...batch]
      page++
    }
    const uris = photos.map((p) => p.url)
    this.log(`Saving ${uris.length} photos...`)
    await scrapeMergeData(scrape_id, {
      photos: uris, // field is kept for backwards compat
      photos_with_captions: photos,
    })
  }

  async parsePhotoPage(page = 0) {
    const offset = page * 50
    const path =
      `DynamicPlacementAjax?detail=${this.detail_id}` +
      `&albumViewMode=hero&placementRollUps=responsive-photo-viewer&metaReferer=Restaurant_Review&offset=${offset}`
    const html = await axios.get(TRIPADVISOR_PROXY + path, {
      headers: AXIOS_HEADERS,
    })
    if (typeof html.data !== 'string') {
      console.log('error data', html.data)
      throw new Error(`Invalid data: ${typeof html.data}`)
    }
    const $ = cheerio.load(html.data)
    const photos = $('.tinyThumb')
    let parsed: any[] = []
    if (html.data.includes('Oh, snap! We don&#39;t have any photos for')) {
      return false
    }
    for (let i = 0; i < photos.length; i++) {
      const photo = $(photos[i])
      const url = $(photo).attr('data-bigurl')
      let caption = $(photo).attr('data-captiontext')
      if (caption) {
        caption = decodeEntities(caption)
      }
      parsed.push({
        url,
        caption,
      })
    }
    return parsed
  }

  extractDetailID(path: string) {
    const re = new RegExp(/-d([0-9]*)-/)
    let matches = re.exec(path)
    if (!matches) throw new Error("Couldn't parse detail_id from Tripadvisor URL")
    const detail_id = matches[1]
    return detail_id
  }

  static cleanName(name: string) {
    let restaurant_name_parts = name.split(', ')
    restaurant_name_parts.pop()
    return restaurant_name_parts.join(', ')
  }

  private _getOverview(data: ScrapeData) {
    const source_id = data.redux?.page?.detailId
    const main = data['redux']['api']['responses']
    const overview = main[`/data/1.0/restaurant/${source_id}/overview`]['data']
    return overview
  }

  private _getMenu(data: ScrapeData) {
    let menu: ScrapeData = {}
    const key = 'Menus_getMenuResponse'
    for (const id in data['urqlCache']) {
      const section = data['urqlCache'][id]
      if (section['data']?.hasOwnProperty(key)) {
        menu = section['data'][key]
      }
    }
    return menu
  }

  private _extractEmbeddedJSONData(html: string) {
    const signature = '/data/1.0/restaurants'
    let the_data_line = ''
    for (const line of html.split('\n')) {
      if (line.includes(signature)) {
        the_data_line = line
        break
      }
      if (line.includes('window.__WEB_CONTEXT__')) {
        console.log('---', line)
      }
    }
    if (the_data_line != '') {
      const $ = cheerio.load(the_data_line)
      const script = $('script').html()
      const ast = acorn.parse(script!)
      const value = ast['body'][0].expression.right.properties[0].value
      const json = script!.substring(value.start, value.end)
      return JSON.parse(json)
    } else {
      return {}
    }
  }
}

export async function tripadvisorGetFBC() {
  console.log('Getting Fresh Brew Coffee from Tripadvisor...')
  const tripadvisor_fbc =
    'Restaurant_Review-g60713-d3652374-Reviews-Fresh_Brew_Coffee-San_Francisco_California.html'
  const t = new Tripadvisor()
  await t.getRestaurant(tripadvisor_fbc)
  const restaurant = await restaurantFindOne({ name: 'Fresh Brew Coffee' })
  if (!restaurant) throw new Error('No restaurant after hot fetching Fresh Brew Coffee')
  const geocoder = new GoogleGeocoder()
  const query = restaurant.name + ',' + restaurant.address
  const lon = restaurant.location.coordinates[0]
  const lat = restaurant.location.coordinates[1]
  restaurant.geocoder_id = await geocoder.searchForID(query, lat, lon)
  await restaurantUpdate(restaurant)
  console.log('...got Fresh Brew Coffee from Tripadvisor.')
  return restaurant
}
