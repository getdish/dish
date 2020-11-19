import '@dish/common'

import { sentryException } from '@dish/common'
import { Restaurant, globalTagId, restaurantFindBatch } from '@dish/graph'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'
import { Tabletojson } from 'tabletojson'

import { GoogleGeocoder } from '../GoogleGeocoder'
import { scrapeInsert } from '../scrape-helpers'
import { GooglePuppeteerJob } from './GooglePuppeteerJob'

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
const GOOGLE_DOMAIN = 'https://www.google.com'

const PER_PAGE = 50

String.prototype.replaceAll = function (search, replacement) {
  var target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}

export class GooglePuppeteer extends GooglePuppeteerJob {
  searchEndpoint!: string
  lon!: number
  lat!: number
  name!: string
  address!: string
  googleRestaurantID!: string
  scrape_data: any = {}

  static queue_config: QueueOptions = {
    limiter: {
      max: 4,
      duration: 20000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForCity(city: string) {
    let previous_id = globalTagId
    while (true) {
      const results = await restaurantFindBatch(PER_PAGE, previous_id, city)
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
    const geocoder = new GoogleGeocoder()
    const address = restaurant?.address
    if (!address || address.replaceAll(' ', '') == '') {
      throw new Error('GOOGLE CRAWLER: restaurant has no address')
    }
    const query = restaurant.name + ',' + address
    this.googleRestaurantID = await geocoder.searchForID(
      query,
      restaurant.location.coordinates[1],
      restaurant.location.coordinates[0]
    )
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
    }
    throw "GOOGLE CRAWLER: Couldn't get main page for: " + this.name
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
    this.scrape_data.hours = GooglePuppeteer.convertTableToJSON(html || '')
  }
}
