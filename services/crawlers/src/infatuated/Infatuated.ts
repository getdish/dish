import '@dish/common'

import { restaurantSaveCanonical } from '@dish/graph'
import { Scrape, ScrapeData } from '@dish/models'
import { WorkerJob } from '@dish/worker'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { aroundCoords, geocode } from '../utils'

const INFATUATED_DOMAIN =
  process.env.INFATUATED_PROXY || 'https://www.theinfatuation.com'

const axios = axios_base.create({
  baseURL: INFATUATED_DOMAIN,
  headers: {
    common: {
      'X-My-X-Forwarded-For': 'www.theinfatuation.com',
    },
  },
})

const MAPVIEW_SIZE = 5000

export class Infatuated extends WorkerJob {
  public longest_radius: number

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
    this.longest_radius = (MAPVIEW_SIZE * Math.sqrt(2)) / 2
  }

  async allForCity(city_name: string) {
    console.log(
      'Starting The Infatuation crawler. Using domain: ' + INFATUATED_DOMAIN
    )
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(
      aroundCoords(coords[0], coords[1], MAPVIEW_SIZE, 5)
    )
    for (const box_center of region_coords) {
      await this.runOnWorker('getRestaurants', [box_center])
    }
  }

  async getRestaurants(center: [number, number], start: number = 0) {
    const per_page = 40
    const limit = 40
    const path = '/api/v1/venues/search?'
    const city = 'city=Boston' // Doesn't seem to do anything, but is still required
    const latlon = `lat=${center[0]}&lng=${center[1]}`
    const distance = `view_distance=${this.longest_radius}`
    const pagination = `offset=${start}&limit=${limit}`
    const base = 'sort_order=Highest%20Rated&category%5B%5D=RESTAURANT'
    const query = [latlon, distance, pagination, base, city].join('&')
    const response = await axios.get(path + query)
    const restaurants = response.data.data

    for (const restaurant of restaurants) {
      await this.saveDataFromMapSearch(restaurant)
    }
    if (restaurants.length > 0) {
      await this.runOnWorker('getRestaurants', [center, start + per_page])
    }
  }

  async saveDataFromMapSearch(data: ScrapeData) {
    console.info('Infatuated: saving ' + data.name)
    const lon = data.geo_point.coordinates[0]
    const lat = data.geo_point.coordinates[1]
    const canonical = await restaurantSaveCanonical(
      lon,
      lat,
      data.name,
      data.street
    )
    const scrape = new Scrape({
      source: 'infatuation',
      restaurant_id: canonical.id,
      id_from_source: data.id.toString(),
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      data: {
        data_from_map_search: data,
      },
    })
    await scrape.insert()
    return scrape.id
  }
}
