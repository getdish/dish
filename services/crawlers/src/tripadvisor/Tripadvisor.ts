import '@dish/common'

import { sentryException } from '@dish/common'
import { restaurantFindOne, restaurantUpdate } from '@dish/graph'
import { ProxiedRequests, WorkerJob } from '@dish/worker'
import * as acorn from 'acorn'
import axios from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import * as cheerio from 'cheerio'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { DISH_DEBUG } from '../constants'
import { GoogleGeocoder } from '../google/GoogleGeocoder'
import { ScrapeData, scrapeInsert, scrapeMergeData } from '../scrape-helpers'
import { aroundCoords, curl_cli, decodeEntities, geocode } from '../utils'

const TRIPADVISOR_OG_DOMAIN = 'https://www.tripadvisor.com/'
const TRIPADVISOR_DOMAIN = process.env.TRIPADVISOR_PROXY || TRIPADVISOR_OG_DOMAIN
const AXIOS_HEADERS = {
  'X-My-X-Forwarded-For': TRIPADVISOR_OG_DOMAIN,
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
  'Accept-Language': 'en-GB,en;q=0.5',
  'accept-encoding': 'deflate, gzip, zstd',
}

const tripadvisorAPI = new ProxiedRequests(TRIPADVISOR_OG_DOMAIN, '', {}, false)

export class Tripadvisor extends WorkerJob {
  public scrape_id!: string
  public MAPVIEW_SIZE = 1000
  public SEARCH_RADIUS_MULTIPLIER = 10
  public _TESTS__LIMIT_GEO_SEARCH = false
  public detail_id!: string
  public restaurant_name!: string

  static queue_config: QueueOptions = {
    limiter: {
      max: 5,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForCity(city_name: string) {
    console.log('Starting Tripadvisor crawler. Using domain: ' + TRIPADVISOR_DOMAIN)
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
      '/GMapsLocationController?' +
      'Action=update&from=Restaurants&g=1&mapProviderFeature=ta-maps-gmaps3&validDates=false' +
      '&pinSel=v2&finalRequest=false&includeMeta=false&trackPageView=false'
    const dimensions = `&mz=17&mw=${this.MAPVIEW_SIZE}&mh=${this.MAPVIEW_SIZE}`
    const coords = `&mc=${lat},${lon}`
    const uri = TRIPADVISOR_DOMAIN + base + dimensions + coords
    const response = await axios.get(uri, { headers: AXIOS_HEADERS })

    for (const data of response.data.restaurants) {
      await this.runOnWorker('getRestaurant', [data.url])
      if (this._TESTS__LIMIT_GEO_SEARCH) break
    }
  }

  async getRestaurant(path: string) {
    this.detail_id = this.extractDetailID(path)
    const html = await this.curl_cli_retries(
      path,
      "--compressed -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0'"
    )
    let data = this._extractEmbeddedJSONData(html)
    const scrape_id = await this.saveRestaurant(data)
    if (!scrape_id) throw new Error("Tripadvisor crawler couldn't save restaurant")
    await this.savePhotos(scrape_id)
    await this.saveReviews(path, scrape_id, 0, html)
    this.log(`"${this.restaurant_name}" scrape complete`)
  }

  async saveRestaurant(data: ScrapeData) {
    const overview = this._getOverview(data)
    const menu = this._getMenu(data)
    if (process.env.RUN_WITHOUT_WORKER != 'true') {
      console.info('Tripadvisor: saving ' + overview.name)
    }
    const id_from_source = overview.detailId.toString()
    const lon = overview.location.longitude
    const lat = overview.location.latitude
    const restaurant_name = Tripadvisor.cleanName(overview.name)
    this.restaurant_name = restaurant_name
    const restaurant_id = await restaurantSaveCanonical(
      'tripadvisor',
      id_from_source,
      lon,
      lat,
      restaurant_name,
      overview.contact.address
    )
    if (process.env.RUN_WITHOUT_WORKER == 'true') {
      console.log('TRIPADVISOR: found canonical restaurant ID: ' + restaurant_id)
    }
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

  async saveReviews(path: string, scrape_id: string, page: number, html: string = '') {
    if (html == '') {
      html = await this.curl_cli_retries(
        path,
        "-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0'"
      )
    }
    const more = await this._persistReviewData(html, scrape_id, page, path)
    if (more) {
      page++
      if (page == 1) {
        path = path.replace('-Reviews-', `-Reviews-or${page * 10}-`)
      } else {
        path = path.replace(/-Reviews-or[0-9]*0-/, `-Reviews-or${page * 10}-`)
      }
      await this.runOnWorker('saveReviews', [path, scrape_id, page])
    }
  }

  async curl_cli_retries(path: string, args: string = '') {
    let html = ''
    let tries = 0
    const max_tries = 1000
    const PROXY =
      process.env.LUMINATI_PROXY_RESIDENTIAL_USER +
      ':' +
      process.env.LUMINATI_PROXY_RESIDENTIAL_PASSWORD +
      '@' +
      process.env.LUMINATI_PROXY_HOST +
      ':' +
      process.env.LUMINATI_PROXY_PORT
    while (tries < max_tries) {
      try {
        html = await curl_cli(
          TRIPADVISOR_OG_DOMAIN + path,
          args + ' ' + ['--max-time 5', `--proxy 'https://${PROXY}'`].join(' ')
        )
      } catch (error) {
        if (!error.message.includes('timed out')) {
          throw new Error(error)
        }
      }
      // TODO find a better a way of detecting success than counting chars!
      if (html.length > 2000) {
        return html
      } else {
        this.log('Retrying: ' + path)
      }
      tries += 1
    }
    throw new Error(`Couldn't get ${path} in ${max_tries}`)
  }

  async savePhotos(scrape_id: string) {
    let page = 0
    let photos: any[] = []
    while (true) {
      // TODO run on worker
      const result = await this.parsePhotoPage(page)
      if (!result) break
      const batch = result
      photos = [...photos, ...batch]
      page++
    }
    const uris = photos.map((p) => p.url)
    await scrapeMergeData(scrape_id, {
      photos: uris, // field is kept for backwards compat
      photos_with_captions: photos,
    })
  }

  async parsePhotoPage(page = 0) {
    if (DISH_DEBUG >= 2) {
      this.log(`Fetching photo page ${page}`)
    }
    const path = this.buildGalleryURL(page)
    const response = await axios.get(TRIPADVISOR_DOMAIN + path, {
      headers: Object.assign(AXIOS_HEADERS, { 'X-Requested-With': 'XMLHttpRequest' }),
    })
    const html = response.data
    const $ = cheerio.load(html)
    const photos = $('.tinyThumb')
    let parsed: any[] = []
    const no_more_photos_sig = 'Oh, snap! We don&#39;t have any photos for'
    if (html.includes(no_more_photos_sig)) {
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

  buildGalleryURL(page = 0) {
    let path = '/DynamicPlacementAjax?'
    const offset = page * 50
    const params = [
      'detail=' + this.detail_id,
      'albumViewMode=hero',
      'placementRollUps=responsive-photo-viewer',
      'metaReferer=Restaurant_Review',
      'offset=' + offset,
    ].join('&')
    return path + params
  }

  extractDetailID(path: string) {
    const re = new RegExp(/-d([0-9]*)-/)
    let matches = re.exec(path)
    if (!matches) throw "Couldn't parse detail_id from Tripadvisor URL"
    const detail_id = matches[1]
    return detail_id
  }

  static cleanName(name: string) {
    let restaurant_name_parts = name.split(', ')
    restaurant_name_parts.pop()
    return restaurant_name_parts.join(', ')
  }

  private async _persistReviewData(html: string, scrape_id: string, page: number, path: string) {
    if (process.env.DISH_ENV != 'production' && page > 2) {
      this.log('stopping reviews early in non-production')
      return false
    }
    const { more, data: review_data } = await this._extractReviews(html, path)
    if (!review_data) return false
    let scrape_data: ScrapeData = {}
    scrape_data['reviewsp' + page] = review_data
    await scrapeMergeData(scrape_id, scrape_data)
    return more
  }

  private async _extractReviews(html: string, path: string) {
    const full = await this.getFullReviews(html, path)
    if (!full.data) {
      return full
    }
    const updated_html = full.data
    const $ = cheerio.load(updated_html)
    const reviews = $('.reviewSelector')
    let data: ScrapeData[] = []
    for (let i = 0; i < reviews.length; i++) {
      const review = $(reviews[i])
      data.push({
        // TODO: Get actual internal username
        username: review.find('.memberInfoColumn .info_text').text(),
        rating: this._getRatingFromClasses(review),
        quote: review.find('.quote .noQuotes').text(),
        text: review.find('.partial_entry').text(),
        date: review.find('.ratingDate').attr('title'),
      })
    }
    return { more: full.more, data: data }
  }

  private async getFullReviews(html: string, referer_path: string) {
    let ids: string[] = []
    const $ = cheerio.load(html)
    const reviews = $('#REVIEWS .listContainer .review-container')
    let more = false
    for (let i = 0; i < reviews.length; i++) {
      const review = $(reviews[i])
      const id = review.find('.reviewSelector').attr('data-reviewid')
      if (!id) continue
      ids.push(id)
    }
    if (ids.length == 0) {
      return { more: false, data: null }
    }
    const path = 'OverlayWidgetAjax?Mode=EXPANDED_HOTEL_REVIEWS_RESP&metaReferer='
    const updated_html = await this.curlFullReviews(path, referer_path, ids)
    // const updated_html = await this.playrightFullReviews(TRIPADVISOR_OG_DOMAIN + path, referer_path, ids)
    try {
      if (!$('.ui_pagination > a.next')!.attr('class')!.includes('disabled')) {
        more = true
      }
    } catch (error) {
      // TODO it seems this is only triggered when there are 0 reviews
      sentryException(error)
    }
    return { more, data: updated_html }
  }

  private async curlFullReviews(path: string, referer_path: string, ids: string[]) {
    const args = [
      "-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0'",
      "-H 'Accept: text/html, */*; q=0.01'",
      "-H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8'",
      "-H 'X-Requested-With: XMLHttpRequest'",
      `-H 'Referer: ${referer_path}'`,
      `--data-raw 'reviews=${ids.join(',')}'`,
    ].join(' ')
    return await this.curl_cli_retries(path, args)
  }

  // Is Playwright setup to skip the AWS proxy?
  private async playrightFullReviews(url: string, referer_path: string, ids: string[]) {
    const options = {
      method: 'POST',
      data: ids.join('%2C'),
      timeout: null,
      headers: {
        Referer: TRIPADVISOR_OG_DOMAIN + referer_path,
      },
    }
    const response = await tripadvisorAPI.get(url, options)
    return await response.text()
  }

  private _getRatingFromClasses(review: any) {
    let rating: number | null = null
    const classes = review.find('.ui_bubble_rating').attr('class')!.split(' ')

    for (let i = 0; i < classes.length; i++) {
      const classname = classes[i]
      if (classname.startsWith('bubble_')) {
        rating = parseInt(classname.split('_')[1]) / 10
      }
    }
    return rating
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
