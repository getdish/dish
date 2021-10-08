import '@dish/common'

import { WorkerJob } from '@dish/worker'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { ScrapeData, scrapeInsert } from '../scrape-helpers'
import { aroundCoords, geocode } from '../utils'

const INFATUATION_DOMAIN = process.env.INFATUATION_PROXY || 'https://www.theinfatuation.com'

const axios = axios_base.create({
  baseURL: INFATUATION_DOMAIN,
  headers: {
    common: {
      'X-My-X-Forwarded-For': 'www.theinfatuation.com',
    },
  },
})

const MAPVIEW_SIZE = 5000

export class Infatuation extends WorkerJob {
  public longest_radius: number

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
    this.longest_radius = (MAPVIEW_SIZE * Math.sqrt(2)) / 2
  }

  async allForCity(city_name: string) {
    console.log('Starting The Infatuation crawler. Using domain: ' + INFATUATION_DOMAIN)
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(aroundCoords(coords[0], coords[1], MAPVIEW_SIZE, 5))
    for (const box_center of region_coords) {
      await this.runOnWorker('getRestaurants', [{ center: box_center }])
    }
  }

  async getRestaurants({
    start = 0,
    center,
    returnResults,
  }: {
    center: [number, number]
    start?: number
    returnResults?: boolean
  }) {
    const per_page = 40
    const limit = 40
    const path = '/api/v1/venues/search?'
    const city = 'city=Boston' // Doesn't seem to do anything, but is still required
    const latlon = `lat=${center[0]}&lng=${center[1]}`
    const distance = `view_distance=${this.longest_radius}`
    const pagination = `offset=${start}&limit=${limit}`
    const base = 'sort_order=Highest%20Rated&category%5B%5D=RESTAURANT'
    const query = [latlon, distance, pagination, base, city].join('&')
    console.log('infatuation search GET', INFATUATION_DOMAIN + path + query)
    const response = await axios.get(path + query)
    const restaurants = response.data.data
    if (returnResults) {
      return restaurants
    }
    for (const restaurant of restaurants) {
      await this.saveDataFromMapSearch(restaurant)
    }
    if (restaurants.length > 0) {
      await this.runOnWorker('getRestaurants', [{ center, start: start + per_page }])
    }
  }

  async saveDataFromMapSearch(data: ScrapeData) {
    console.info('Infatuation: saving ' + data.name)
    const id_from_source = data.id.toString()
    const lon = data.geo_point.coordinates[0]
    const lat = data.geo_point.coordinates[1]
    const restaurant_id = await restaurantSaveCanonical(
      'infatuation',
      id_from_source,
      lon,
      lat,
      data.name,
      data.street
    )
    if (process.env.DEBUG) {
      console.log('Infatuation data', data)
    }
    const id = await scrapeInsert({
      source: 'infatuation',
      restaurant_id,
      id_from_source,
      location: {
        lon: lon,
        lat: lat,
      },
      data: {
        data_from_search_list_item: data,
      },
    })
    return id
  }

  static getNameAndAddress(scrape: ScrapeData) {
    return {
      name: scrape.data.data_from_search_list_item.name,
      address: scrape.data.data_from_search_list_item.street,
    }
  }
}
