import '@dish/common'

import dotenv from 'dotenv'
dotenv.config()

import axios, { AxiosResponse } from 'axios'
import { QueueOptions, JobOptions } from 'bull'

import { WorkerJob } from '@dish/worker'
import { Restaurant, Dish } from '@dish/models'

import categories from './categories.json'

const UBEREATS_DOMAIN =
  process.env.UBEREATS_PROXY || 'https://www.ubereats.com/'
const LOCALE = '?localeCode=en-US'
const CITIES = 'getCountriesWithCitiesV1'
const FEED = 'getFeedV1'
const STORE = 'getStoreV1'
const HEREMAPS_API_TOKEN = process.env.HEREMAPS_API_TOKEN
const PER_PAGE = 80
axios.defaults.baseURL = UBEREATS_DOMAIN + 'api/'
axios.defaults.headers.common['x-csrf-token'] = 'x'

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

  async getCities() {
    const response = await axios.post(CITIES, {})
    for (let country of response.data.data) {
      console.log(country.countryDisplayName)
      for (let city of country.cities) {
        console.log(city.cityId, city.cityDisplayName)
      }
    }
  }

  async getFeed(lat: number, lon: number) {
    this.run_on_worker('getFeedPage', {
      offset: 0,
      category: '',
      lat: lat,
      lon: lon,
    })
  }

  async getFeedPage({
    offset,
    category,
    lat,
    lon,
  }: {
    offset: number
    category: string
    lat: number
    lon: number
  }) {
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

    this.extractRestaurantsFromFeed(response, offset, category)

    if (response.data.data.meta.hasMore) {
      this.run_on_worker('getFeedPage', {
        offset: response.data.data.meta.offset,
        category: category,
        lat: lat,
        lon: lon,
      })
    }
  }

  extractRestaurantsFromFeed(
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
        this.run_on_worker('getRestaurant', item.uuid)
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
    const restaurant = response.data.data
    const restaurant_id = await this.saveRestaurant(restaurant)
    await this.getDishes(restaurant, restaurant_id)
  }

  private async saveRestaurant(data: any) {
    console.log('Saving restaurant: ' + data.title)
    const restaurant = new Restaurant({
      name: data.title,
      description: data.categories && data.categories.join(', '),
      location: {
        type: 'Point',
        coordinates: [data.location.longitude, data.location.latitude],
      },
      address: data.location.address,
      city: data.location.city,
      state: '',
      zip: 0,
      image: data.heroImageUrls.length > 0 ? data.heroImageUrls[0].url : '',
    })
    await restaurant.upsert()
    return restaurant.id
  }

  private async getDishes(data: any, restaurant_id: string) {
    for (const sid in data.sectionEntitiesMap) {
      for (const did in data.sectionEntitiesMap[sid]) {
        const item = data.sectionEntitiesMap[sid][did]
        const dish = new Dish({
          restaurant_id: restaurant_id,
          name: item.title,
          description: item.description,
          price: item.price,
          image: item.imageUrl,
        })
        await dish.upsert()
      }
    }
  }

  // TODO: Refactor out to utilities
  async geocode(address: string) {
    const base = 'https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey='
    const query = '&searchtext=' + address
    const url = base + HEREMAPS_API_TOKEN + query
    const response = await axios.get(url)
    console.log(response.data.Response.View.Result.Location)
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
