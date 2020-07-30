import '@dish/common'

import { sentryException } from '@dish/common'
import {
  Restaurant,
  globalTagId,
  restaurantFindBatch,
  settingFindOne,
  settingUpsert,
} from '@dish/graph'
import { ProxiedRequests, WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'
import { Tabletojson } from 'tabletojson'

import { Puppeteer } from '../Puppeteer'
import { scrapeInsert } from '../scrape-helpers'
import { sanfran } from '../utils'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
const PLEASE = 'PLEASE'
const LON_TOKEN = '%LON%'
const LAT_TOKEN = '%LAT%'
const GOOGLE_DOMAIN = 'https://www.google.com'
const googleAPI = new ProxiedRequests(
  GOOGLE_DOMAIN,
  process.env.GOOGLE_AWS_PROXY || GOOGLE_DOMAIN,
  {
    headers: {
      common: {
        'X-My-X-Forwarded-For': 'www.google.com',
      },
    },
  }
)

const GOOGLE_SEARCH_ENDPOINT_KEY = 'GOOGLE_SEARCH_ENDPOINT'
const PER_PAGE = 50

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

export class Google extends WorkerJob {
  puppeteer: Puppeteer
  searchEndpoint!: string
  lon!: number
  lat!: number
  name!: string
  address!: string
  googleRestaurantID!: string
  scrape_data: any = {}
  booted = false

  static queue_config: QueueOptions = {
    limiter: {
      max: 4,
      duration: 20000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  constructor() {
    super()
    this.puppeteer = new Puppeteer(GOOGLE_DOMAIN, process.env.GOOGLE_AWS_PROXY)
    this.puppeteer.watch_requests_for = 'search?'
  }

  async boot() {
    await this.puppeteer.boot()
    this.booted = true
  }

  async main() {
    let previous_id = globalTagId
    while (true) {
      const results = await restaurantFindBatch(PER_PAGE, previous_id, sanfran)
      if (results.length == 0) {
        break
      }
      for (const result of results) {
        await this.runOnWorker('getRestaurant', [result])
        previous_id = result.id as string
      }
    }
  }

  async getRestaurant(restaurant: Restaurant) {
    if (!this.booted) await this.boot()
    this.lon = restaurant.location.coordinates[0]
    this.lat = restaurant.location.coordinates[1]
    if (!restaurant.name) {
      throw new Error("Google crawler: restaurant doesn't have a name")
    }
    this.name = restaurant.name
    this.address = restaurant.address?.split(',')[0] || ''
    if (!this.searchEndpoint) {
      await this.getSearchEndpoint()
    }
    this.googleRestaurantID = await this.searchForID()
    await this.getAllData(restaurant)
    await scrapeInsert({
      restaurant_id: restaurant.id,
      source: 'google',
      id_from_source: this.googleRestaurantID,
      location: {
        lon: restaurant.location.coordinates[0],
        lat: restaurant.location.coordinates[1],
      },
      data: this.scrape_data,
    })
    if (process.env.DISH_ENV != 'production') {
      this.puppeteer.close()
    }
  }

  async getAllData(restaurant: Restaurant) {
    this.scrape_data.page_url = this.puppeteer.page.url()
    const steps = [
      this.getMainPage,
      this.getHeroImage,
      this.getPricing,
      this.getRating,
      this.getAddress,
      this.getHours,
      this.getWebsite,
      this.getPhone,
      this.getSynopsis,
      this.getPhotos,
      this.getReviews,
    ]
    for (const step of steps) {
      await this._runFailableFunction(step, restaurant)
    }
  }

  async _runFailableFunction(func: Function, restaurant: Restaurant) {
    console.log('GOOGLE: Running failable step: ' + func.name)
    try {
      await func.bind(this)()
    } catch (e) {
      if (!e.message.includes('waiting for selector')) {
        sentryException(
          e,
          { function: func.name, restaurant: restaurant },
          { source: 'Google crawler' }
        )
      }
    }
  }

  async getMainPage() {
    let retries = 0
    while (retries < 4) {
      const url =
        GOOGLE_DOMAIN +
        `/maps/place/@${this.lat},${this.lon},17z/` +
        `data=!3m1!4b1!4m5!3m4!1s${this.googleRestaurantID}` +
        `!8m2!3d${this.lat}!4d${this.lon}`
      await this.puppeteer.page.goto(url)
      if (await this._hasSearchExpired()) {
        await this.getNewSearchEndpoint()
        this.googleRestaurantID = await this.searchForID()
        retries += 1
      } else {
        return
      }
    }
    throw "GOOGLE CRAWLER: Couldn't get main page for: " + this.name
  }

  // Example of expired search:
  // "search?tbm=map&authuser=0&hl=en&gl=us&pb=!4m9!1m3!1d3285.0632427323467!2d%LON%!3d%LAT%!2m0!3m2!1i1366!2i800!4f13.1!7i20!10b1!12m8!1m1!18b1!2m3!5m1!6e2!20e3!10b1!16b1!19m4!2m3!1i360!2i120!4i8!20m57!2m2!1i203!2i100!3m2!2i4!5b1!6m6!1m2!1i86!2i86!1m2!1i408!2i240!7m42!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e3!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e3!2b1!3e2!1m3!1e9!2b1!3e2!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!2b1!4b1!9b0!22m6!1schwPX7CqB9H99AOy-r0o%3A1!2s1i%3A0%2Ct%3A11886%2Cp%3AchwPX7CqB9H99AOy-r0o%3A1!7e81!12e5!17schwPX7CqB9H99AOy-r0o%3A2!18e15!24m50!1m12!13m6!2b1!3b1!4b1!6i1!8b1!9b1!18m4!3b1!4b1!5b1!6b1!2b1!5m5!2b1!3b1!5b1!6b1!7b1!10m1!8e3!14m1!3b1!17b1!20m4!1e3!1e6!1e14!1e15!24b1!25b1!26b1!30m1!2b1!36b1!43b1!52b1!54m1!1b1!55b1!56m2!1b1!3b1!65m5!3m4!1m3!1m2!1i224!2i298!26m4!2m3!1i80!2i92!4i8!30m28!1m6!1m2!1i0!2i0!2m2!1i458!2i800!1m6!1m2!1i1316!2i0!2m2!1i1366!2i800!1m6!1m2!1i0!2i0!2m2!1i1366!2i20!1m6!1m2!1i0!2i780!2m2!1i1366!2i800!34m14!2b1!3b1!4b1!6b1!8m4!1b1!3b1!4b1!6b1!9b1!12b1!14b1!20b1!23b1!37m1!1e81!42b1!47m0!49m1!3b1!50m4!2e2!3m2!1b1!3b1!65m0&q=P%20LEASE&oq=P%20LEASE&gs_l=maps.3...158.237.1.246.5.1.0.0.0.0.0.0..0.0....0...1ac.1.64.maps..5.0.0....0.&tch=1&ech=1&psi=chwPX7CqB9H99AOy-r0o.1594825843774.1"
  async _hasSearchExpired() {
    const title = await this.puppeteer.getElementText(
      '.section-hero-header-title-title'
    )
    const is_blank_page = this.puppeteer.page.url() == 'about:blank'
    return is_blank_page || title.toLowerCase().includes('please')
  }

  async getSearchEndpoint() {
    const result = await settingFindOne({
      key: GOOGLE_SEARCH_ENDPOINT_KEY,
    })
    if (result) {
      this.searchEndpoint = result.value
    } else {
      await this.getNewSearchEndpoint()
    }
  }

  // So, because of a problem with using the search box in Puppeteer, we need to
  // manually make search API requests with our HTTP client. But in order to do
  // this we need a particular string in the API request that seems to be some
  // kind of short-lived session token. To find this token we have to at least
  // attempt to use the search box on a Google Maps page, and then listen for
  // the relevant search API request.
  async getNewSearchEndpoint() {
    console.log('GOOGLE CRAWLER: getting new search endpoint')
    await this.puppeteer.restartBrowser()
    await this._catchSearchEndpoint()
    this._templatiseSearchEndpoint()
    await settingUpsert([
      {
        key: GOOGLE_SEARCH_ENDPOINT_KEY,
        value: this.searchEndpoint,
      },
    ])
  }

  // This seems pointless, but it's the interaction that triggers the page into
  // making the all-important search API request that contains the search token we
  // can later reuse.
  //
  // The search token doesn't *seem* to be location dependent, but we randomise the
  // lat/lon here just to hide ourselves from any Google automation.
  async _theBrokenSearchBoxInteraction(
    randomish_lon: number,
    randomish_lat: number
  ) {
    const url = GOOGLE_DOMAIN + `/maps/@${randomish_lat},${randomish_lon},17z/`
    const page = this.puppeteer.page
    await page.goto(url)
    await page.focus('#searchboxinput')
    await page.keyboard.type(PLEASE)
    await page.keyboard.press('Enter')
  }

  async _catchSearchEndpoint() {
    let retries = 0
    while (retries < 4) {
      await this._theBrokenSearchBoxInteraction(this.lon, this.lat)
      await this._waitForSearchAPIRequest()
      if (this.puppeteer.found_watched_request) {
        break
      } else {
        await this.puppeteer.page.reload()
        retries++
      }
    }
    if (!this.puppeteer.found_watched_request) {
      throw new Error('Google search API not seen after ' + retries + ' tries')
    }
  }

  async _waitForSearchAPIRequest() {
    let count = 0
    while (!this.puppeteer.found_watched_request) {
      await sleep(50)
      count++
      if (count > 500) break
    }
  }

  _templatiseSearchEndpoint() {
    this.searchEndpoint = this.puppeteer.found_watched_request
      .replaceAll('https://www.google.com/', '')
      .replaceAll(this.lon.toString(), LON_TOKEN)
      .replaceAll(this.lat.toString(), LAT_TOKEN)
  }

  getSearchURL() {
    const term = this.name + ', ' + this.address
    return this.searchEndpoint
      .replaceAll(LON_TOKEN, this.lon.toString())
      .replaceAll(LAT_TOKEN, this.lat.toString())
      .replaceAll(PLEASE, encodeURIComponent(term))
  }

  async searchForID() {
    let retries = 0
    while (retries < 3) {
      try {
        return await this._searchForID()
      } catch (e) {
        if (e.message.includes('no ID found for')) {
          retries++
          await this.getNewSearchEndpoint()
        } else {
          throw new Error(e)
        }
      }
    }
    throw new Error(
      'GOOGLE CRAWLER: retries failed getting ID for: ' + this.name
    )
  }

  async _searchForID() {
    const url = this.getSearchURL()
    const response = await googleAPI.get(url, {
      headers: { 'user-agent': 'PLEASE' },
    })
    const matches = response.data.match(/(0x[a-f0-9]{16}:0x[a-f0-9]{16})/)
    if (matches) {
      return matches[0]
    } else {
      throw new Error(`GOOGLE CRAWLER: no ID found for "${this.name}"`)
    }
  }

  static convertTableToJSON(html: string) {
    let json = Tabletojson.convert(html, {
      useFirstRowForHeadings: true,
      headings: ['day', 'hours'],
      ignoreColumns: [2],
    })[0]
    return json.map((row) => {
      const hours = row.hours.split('\n')[0]
      return { day: row.day, hours }
    })
  }

  async getHeroImage() {
    const selector = '.section-hero-header-image-hero img'
    await this.puppeteer.getElementText(selector)
    this.scrape_data.hero_image = await this.puppeteer.page.evaluate(
      (selector) => {
        return document.querySelector(selector)?.getAttribute('src')
      },
      selector
    )
  }

  async getSynopsis() {
    this.scrape_data.synopsis = (
      await this.puppeteer.getElementText('.section-editorial-quote')
    ).trim()
  }

  async getRating() {
    this.scrape_data.rating = (
      await this.puppeteer.getElementText('.section-star-display')
    ).trim()
  }

  async getPricing() {
    this.scrape_data.pricing = (
      await this.puppeteer.getElementText('[aria-label*="Price:"]')
    ).trim()
  }

  async getAddress() {
    this.scrape_data.address = (
      await this.puppeteer.getElementText('[data-tooltip*="Copy address"]')
    ).trim()
  }

  async getWebsite() {
    this.scrape_data.website = (
      await this.puppeteer.getElementText('[data-tooltip*="Open website"]')
    ).trim()
  }

  async getPhone() {
    this.scrape_data.telephone = (
      await this.puppeteer.getElementText('[data-tooltip*="Copy phone number"]')
    ).trim()
  }

  async getHours() {
    const html = await this.puppeteer.page.evaluate(() => {
      const selector = '.section-open-hours-container'
      return document.querySelector(selector)?.innerHTML
    })
    this.scrape_data.hours = Google.convertTableToJSON(html || '')
  }

  async getPhotos() {
    const button = '.section-hero-header-image-hero'
    await this.puppeteer.page.click(button)
    const selector = '.gallery-image-low-res'
    await this.puppeteer.getElementText(selector)
    await this.puppeteer.scrollAllIntoView(selector)
    const photos = await this.puppeteer.page.evaluate((selector) => {
      const photos = Array.from(document.querySelectorAll(selector))
      return photos.map((el) => {
        const computed = window.getComputedStyle(el)
        const bg = computed.getPropertyValue('background-image')
        const url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '')
        return url
      })
    }, selector)
    this.scrape_data.photos = photos
  }

  async getReviews() {
    const url =
      GOOGLE_DOMAIN +
      `/maps/place/@${this.lat},${this.lon},17z/` +
      `data=!4m7!3m6!1s${this.googleRestaurantID}` +
      `!8m2!3d${this.lat}!4d${this.lon}!9m1!1b1`
    await this.puppeteer.page.goto(url)
    await sleep(1000)
    await this.puppeteer.scrollAllIntoView('.section-review')
    const reviews = await this.puppeteer.page.evaluate(() => {
      const reviews = Array.from(document.querySelectorAll('.section-review'))
      return reviews.map((el) => {
        return (<HTMLElement>el).innerText
      })
    })
    this.scrape_data.reviews = reviews
  }
}
