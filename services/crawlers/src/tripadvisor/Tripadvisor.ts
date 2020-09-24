import '@dish/common'

import { sentryException } from '@dish/common'
import { WorkerJob } from '@dish/worker'
import * as acorn from 'acorn'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import * as cheerio from 'cheerio'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { ScrapeData, scrapeInsert, scrapeMergeData } from '../scrape-helpers'
import { aroundCoords, geocode } from '../utils'

const TRIPADVISOR_DOMAIN =
  process.env.TRIPADVISOR_PROXY || 'https://www.tripadvisor.com'

const axios = axios_base.create({
  baseURL: TRIPADVISOR_DOMAIN,
  headers: {
    common: {
      'X-My-X-Forwarded-For': 'www.tripadvisor.com',
    },
  },
})

export class Tripadvisor extends WorkerJob {
  public scrape_id!: string
  public MAPVIEW_SIZE = 1000
  public SEARCH_RADIUS_MULTIPLIER = 10
  public _TESTS__LIMIT_GEO_SEARCH = false

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
    console.log(
      'Starting Tripadvisor crawler. Using domain: ' + TRIPADVISOR_DOMAIN
    )
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(
      aroundCoords(
        coords[0],
        coords[1],
        this.MAPVIEW_SIZE,
        this.SEARCH_RADIUS_MULTIPLIER
      )
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
    const response = await axios.get(uri)

    for (const data of response.data.restaurants) {
      await this.runOnWorker('getRestaurant', [data.url])
      if (this._TESTS__LIMIT_GEO_SEARCH) break
    }
  }

  async getRestaurant(path: string) {
    const response = await axios.get(TRIPADVISOR_DOMAIN + path)
    let data = this._extractEmbeddedJSONData(response.data)
    const scrape_id = await this.saveRestaurant(data)
    await this.savePhotos(response.data, scrape_id)
    await this.saveReviews(path, scrape_id, 0, response.data)
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
    const restaurant_id = await restaurantSaveCanonical(
      'tripadvisor',
      id_from_source,
      lon,
      lat,
      restaurant_name,
      overview.contact.address
    )
    if (process.env.RUN_WITHOUT_WORKER == 'true') {
      console.log(
        'TRIPADVISOR: found canonical restaurant ID: ' + restaurant_id
      )
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

  async saveReviews(
    path: string,
    scrape_id: string,
    page: number,
    html: string = ''
  ) {
    if (html == '') {
      const response = await axios.get(TRIPADVISOR_DOMAIN + path)
      html = response.data
    }
    const more = await this._persistReviewData(html, scrape_id, page)
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

  // TODO: load further pages on photo carousel as this only loads the first 10 or so
  async savePhotos(html: string, scrape_id: string) {
    const $ = cheerio.load(html)
    const photos = $('.mosaic_photos .basicImg')
    let uris: string[] = []
    for (let i = 0; i < photos.length; i++) {
      const photo = $(photos[i])
      const uri = photo
        .attr('data-lazyurl')!
        .replace(/\/photo-.\//, '/photo-w/')
      uris.push(uri)
    }
    await scrapeMergeData(scrape_id, { photos: uris })
  }

  static cleanName(name: string) {
    let restaurant_name_parts = name.split(', ')
    restaurant_name_parts.pop()
    return restaurant_name_parts.join(', ')
  }

  private async _persistReviewData(
    html: string,
    scrape_id: string,
    page: number
  ) {
    if (process.env.DISH_ENV != 'production' && page > 2) return false
    const { more, data: review_data } = this._extractReviews(html)
    let scrape_data: ScrapeData = {}
    scrape_data['reviewsp' + page] = review_data
    await scrapeMergeData(scrape_id, scrape_data)
    return more
  }

  // TODO: Full review text needs a separate request with something like:
  // curl 'https://www.tripadvisor.com/OverlayWidgetAjax\
  //   ?Mode=EXPANDED_HOTEL_REVIEWS_RESP&metaReferer=' \
  //   --compressed -H 'X-Requested-With: XMLHttpRequest' \
  //   -H 'Referer: https://www.tripadvisor.com/Restaurant_Review-g60713-d1516973-Reviews-Flour_Water-San_Francisco_California.html' \
  //   --data 'reviews=733608852,733186400,724243903,720450724,714340566,702434557,700388923,698556394&contextChoice=DETAIL&loadMtHeader=true'
  private _extractReviews(html: string) {
    const $ = cheerio.load(html)
    const reviews = $('#REVIEWS .listContainer .review-container')
    let more = false
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
    try {
      if (!$('.ui_pagination > a.next')!.attr('class')!.includes('disabled')) {
        more = true
      }
    } catch (error) {
      sentryException(error)
    }
    return { more: more, data: data }
  }

  // @tom i changed : Cheerio to any to fix an error in types compiling
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
