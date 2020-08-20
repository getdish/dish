import { settingUpsert } from '@dish/graph'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import {
  GOOGLE_SEARCH_ENDPOINT_KEY,
  LAT_TOKEN,
  LON_TOKEN,
} from '../GoogleGeocoder'
import { GoogleJob } from './GoogleJob'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
const PLEASE = 'PLEASE'

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

export class UpdateSearchEndpoint extends GoogleJob {
  searchEndpoint!: string
  lat!: number
  lon!: number

  static queue_config: QueueOptions = {
    limiter: {
      max: 1,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  constructor() {
    super()
    this.puppeteer.watch_requests_for = 'search?'
  }

  // We need a particular string in the API request that seems to be some
  // kind of short-lived session token. To find this token we have to at least
  // attempt to use the search box on a Google Maps page, and then listen for
  // the relevant search API request.
  async getNewSearchEndpoint() {
    console.log('GOOGLE CRAWLER: getting new search endpoint')
    await this.boot()
    await this._catchSearchEndpoint()
    this._templatiseSearchEndpoint()
    await settingUpsert([
      {
        key: GOOGLE_SEARCH_ENDPOINT_KEY,
        value: this.searchEndpoint,
      },
    ])
    console.log('GOOGLE CRAWLER: search endpoint successfully updated')
  }

  _templatiseSearchEndpoint() {
    this.searchEndpoint = this.puppeteer.found_watched_request
      .replaceAll('https://www.google.com/', '')
      .replaceAll(this.lon.toString(), LON_TOKEN)
      .replaceAll(this.lat.toString(), LAT_TOKEN)
  }

  jitter() {
    const min = -0.01
    const max = 0.01
    return Math.random() * (max - min) + min
  }

  // This seems pointless, but it's the interaction that triggers the page into
  // making the all-important search API request that contains the search token we
  // can later reuse.
  //
  // The search token doesn't *seem* to be location dependent, but we randomise the
  // lat/lon here just to hide ourselves from any Google automation.
  async _theBrokenSearchBoxInteraction() {
    this.lat = 37.7749 + this.jitter()
    this.lon = -122.4194 + this.jitter()
    const url = this.GOOGLE_DOMAIN + `/maps/@${this.lat},${this.lon},17z/`
    const page = this.puppeteer.page
    await page.goto(url)
    await page.focus('#searchboxinput')
    await page.keyboard.type(PLEASE)
    await page.keyboard.press('Enter')
  }

  async _catchSearchEndpoint() {
    let retries = 0
    while (retries < 4) {
      await this._theBrokenSearchBoxInteraction()
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
}
