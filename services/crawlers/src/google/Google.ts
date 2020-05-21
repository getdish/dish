import '@dish/common'

import { ProxiedRequests, WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { Puppeteer } from '../Puppeteer'

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
  googleRestaurantID!: string

  static queue_config: QueueOptions = {
    limiter: {
      max: 5,
      duration: 1000,
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
  }

  async main() {}

  async getRestaurant(lon: number, lat: number, name: string) {
    this.lon = lon
    this.lat = lat
    this.name = name
    if (!this.searchEndpoint) {
      await this.getNewSearchEndpoint()
    }
    this.googleRestaurantID = await this.searchForID()
    await this.getMainPage()
    await this.getSynopsis()
    await this.getReviews()
  }

  async getMainPage() {
    const url =
      GOOGLE_DOMAIN +
      `/maps/place/@${this.lat},${this.lon},17z/` +
      `data=!3m1!4b1!4m5!3m4!1s${this.googleRestaurantID}` +
      `!8m2!3d${this.lat}!4d${this.lon}`
    await this.puppeteer.page.goto(url)
  }

  // So, because of a problem with using the search box in Puppeteer, we need to
  // manually make search API requests with our HTTP client. But in order to do
  // this we need a particular string in the API request that seems to be some
  // kind of short-lived session token. To find this token we have to at least
  // attempt to use the search box on a Google Maps page, and then listen for
  // the relevant search API request.
  async getNewSearchEndpoint() {
    console.log('GOOGLE CRAWLER: getting new search endpoint')
    await this._theBrokenSearchBoxInteraction(this.lon, this.lat)
    await this._waitForSearchAPIRequest()
    this._templatiseSearchEndpoint()
  }

  // This seems pointless, but it's the interaction that triggers the page into
  // making the all-important search API request that contains the search token we
  // can later reuse.
  //
  // The search token doesn't *seem* to be location dependent, but we randomise the
  // lat/lon here just hide ourselves from any Google automation.
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

  async _waitForSearchAPIRequest() {
    let count = 0
    while (!this.puppeteer.found_watched_request) {
      await sleep(50)
      count++
      if (count > 300) throw new Error('Google search API not seen')
    }
  }

  _templatiseSearchEndpoint() {
    this.searchEndpoint = this.puppeteer.found_watched_request
      .replaceAll('https://www.google.com/', '')
      .replaceAll(this.lon.toString(), LON_TOKEN)
      .replaceAll(this.lat.toString(), LAT_TOKEN)
  }

  getSearchURL() {
    return this.searchEndpoint
      .replaceAll(LON_TOKEN, this.lon.toString())
      .replaceAll(LAT_TOKEN, this.lat.toString())
      .replaceAll(PLEASE, encodeURIComponent(this.name))
  }

  async searchForID() {
    let retries = 0
    while (retries < 10) {
      try {
        return await this._searchForID()
      } catch (e) {
        if (e.message.includes('no ID found for')) {
          retries++
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
    const matches = response.data.match(/(0x[a-f0-9]+:0x[a-f0-9]+)/)
    if (matches) {
      return matches[0]
    } else {
      throw new Error(`GOOGLE CRAWLER: no ID found for "${this.name}"`)
    }
  }

  async getSynopsis() {
    const synopsis = await this.puppeteer.getElementText(
      '.section-editorial-quote'
    )
    console.log(synopsis)
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
    const reviews = await this.puppeteer.page.$$('.section-review')
    console.log(reviews.length)
  }
}
