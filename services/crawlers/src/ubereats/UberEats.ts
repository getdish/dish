import '@dish/common'

import _ from 'lodash'
import axios_base, { AxiosResponse } from 'axios'
import { QueueOptions, JobOptions } from 'bull'

import { WorkerJob } from '@dish/worker'
import { Scrape } from '@dish/models'

import categories from './categories.json'

import { aroundCoords, geocode } from '../utils'

const UBEREATS_DOMAIN =
  process.env.UBEREATS_PROXY || 'https://www.ubereats.com/'
const LOCALE = '?localeCode=en-US'
const CITIES = 'getCountriesWithCitiesV1'
const FEED = 'getFeedV1'
const STORE = 'getStoreV1'
const PER_PAGE = 80

const axios = axios_base.create({
  baseURL: UBEREATS_DOMAIN + 'api/',
  headers: {
    common: {
      'x-csrf-token': 'x',
    },
  },
})

console.log('Starting UberEats crawler. Using domain: ' + UBEREATS_DOMAIN)

export class UberEats extends WorkerJob {
  static queue_config: QueueOptions = {
    limiter: {
      max: 1,
      duration: 1500,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  static DELIVERY_RADIUS = 30000

  async world() {
    let cities = await this.getCities()
    cities = _.shuffle(cities)
    for (const city of cities) {
      await this.runOnWorker('getCity', [city])
    }
  }

  async getCities() {
    let cities: string[] = []
    const response = await axios.post(CITIES, {})
    for (let country of response.data.data) {
      for (let city of country.cities) {
        cities.push(`${city.cityDisplayName}, ${country.countryDisplayName}`)
      }
    }
    return cities
  }

  async getCity(city: string) {
    const coords = await geocode(city)
    await this.runOnWorker('aroundCoords', [coords[0], coords[1]])
  }

  async aroundCoords(lat: number, lon: number) {
    const delivery_radius_multiplier = 2
    const coords_set = aroundCoords(
      lat,
      lon,
      UberEats.DELIVERY_RADIUS,
      delivery_radius_multiplier
    )
    for (let coords of coords_set) {
      await this.runOnWorker('getFeedPage', [0, '', coords[0], coords[1]])
    }
  }

  async getFeedPage(
    offset: number,
    category: string,
    lat: number,
    lon: number
  ) {
    console.log(
      `Getting feed for coords: ${lat}, ${lon}, category: '${category}', offset: ${offset}`
    )
    const response = await axios.post(
      FEED + LOCALE,
      {
        pageInfo: {
          offset: offset,
          pageSize: PER_PAGE,
        },
        userQuery: category,
      },
      {
        headers: {
          Cookie: 'uev2.loc=' + this.encodeLocation(lat, lon),
        },
      }
    )

    await this.extractRestaurantsFromFeed(response, offset, category)

    if (response.data.data.meta.hasMore) {
      await this.runOnWorker('getFeedPage', [
        response.data.data.meta.offset,
        category,
        lat,
        lon,
      ])
    }
  }

  async extractRestaurantsFromFeed(
    response: AxiosResponse,
    offset: number,
    category: string
  ) {
    const items = response.data.data.feedItems
    console.log(
      items.length +
        ' restaurants on page: ' +
        offset / 80 +
        ', for category: "' +
        category +
        '"'
    )

    for (let item of items) {
      if (item.type == 'STORE') {
        await this.runOnWorker('getRestaurant', [item.uuid])
      }
    }
  }

  async getRestaurant(uuid: string) {
    const response = await axios.post(
      STORE,
      { storeUuid: uuid },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const data = response.data.data
    const scrape = await this.saveRestaurant(data, uuid)
    await this.getDishes(data, scrape.id)
  }

  private async saveRestaurant(data: any, uuid: string) {
    console.log('Saving restaurant: ' + data.title)
    const scrape = new Scrape({
      source: 'ubereats',
      id_from_source: uuid,
      data: {
        main: data,
      },
      location: {
        type: 'Point',
        coordinates: [data.location.longitude, data.location.latitude],
      },
    })
    await scrape.insert()
    return scrape
  }

  private async getDishes(data: any, scrape_id: string) {
    let dishes = [{}]
    for (const sid in data.sectionEntitiesMap) {
      for (const did in data.sectionEntitiesMap[sid]) {
        dishes.push(data.sectionEntitiesMap[sid][did])
      }
    }
    await Scrape.mergeData(scrape_id, { dishes: dishes })
  }

  private encodeLocation(lat: number, lon: number) {
    // Only latitude and longitude will ever need to be changed. But the other fields seem
    // to be needed for validation.
    const location_template = {
      address: {
        address1: '',
      },
      latitude: lat,
      longitude: lon,
      reference: '',
      referenceType: '',
      type: '',
      source: '',
    }
    return encodeURIComponent(JSON.stringify(location_template))
  }

  // This is a hard-coded list of Uber Eats most popular categories.
  private loadCategories() {
    return categories.JSON.data.categories.map((obj: any) => {
      return obj.title
    })
  }

  // It doesn't actually seem like the cache key is relevant. But keeping just in case.
  // You might need it if there doesn't seem to be any other way the page/API is
  // getting your geo location.
  private async __getCacheKey(lat: number, lon: number) {
    const response = await axios.get('https://www.ubereats.com/en-US/', {
      headers: {
        Accept: 'text/html',
        Cookie: 'uev2.loc=' + this.encodeLocation(lat, lon),
      },
    })
    const url = new URL('http://domain.com' + response.request.path)
    const cache_key = url.searchParams.get('pl')!
    return decodeURIComponent(cache_key)
  }
}
