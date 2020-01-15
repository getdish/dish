import dotenv from 'dotenv'
dotenv.config()

import fs from 'fs'
import axios, { AxiosResponse } from 'axios'

import { WorkerJob } from '@dish/worker'
import { Restaurant } from '@dish/models'

const UBEREATS_DOMAIN =
  process.env.UBEREATS_PROXY || 'https://www.ubereats.com/'
const LOCALE = '?localeCode=en-US'
const CITIES = 'getCountriesWithCitiesV1'
const FEED = 'getFeedV1'
const STORE = 'getStoreV1'
const HEREMAPS_API_TOKEN = process.env.HEREMAPS_API_TOKEN
axios.defaults.baseURL = UBEREATS_DOMAIN + 'api/'
axios.defaults.headers.common['x-csrf-token'] = 'x'

export class UberEats extends WorkerJob {
  async run(args?: any) {
    if ('fn' in args) {
      this[args['fn']](args['args'])
    }
    if ('lat' in args) {
      this.getFeed(args['lat'], args['lon'])
    }
    if (typeof args == undefined || args == 'ALL') {
      await this.getCities()
    }
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
    const categories = this.loadCategories()
    for (const category of categories) {
      await this.getFeedPage(0, category, lat, lon)
    }
  }

  // This is a hard-coded list of Uber Eats most popular categories.
  // TODO: I think we can do better, but I don't know how yet?
  private loadCategories() {
    const content = fs.readFileSync('./src/ubereats_categories.json', 'utf8')
    const json = JSON.parse(content)
    return json.JSON.data.categories.map((obj: any) => {
      return obj.title
    })
  }

  async getFeedPage(
    offset: number,
    category: string,
    lat: number,
    lon: number
  ) {
    const response = await axios.post(
      FEED + LOCALE,
      {
        pageInfo: {
          offset: offset,
          pageSize: 80,
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
      await this.getFeedPage(response.data.data.meta.offset, category, lat, lon)
    }
  }

  extractRestaurantsFromFeed(
    response: AxiosResponse,
    offset: number,
    category: string
  ) {
    console.log(
      response.data.data.feedItems.length +
        ' restaurants on page: ' +
        offset / 80 +
        ', for category: "' +
        category +
        '"'
    )

    for (let item of response.data.data.feedItems) {
      if (item.type == 'STORE') {
        this.run_on_worker({ fn: 'getRestaurant', args: item.uuid })
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
    await this.saveRestaurant(response.data.data)
  }

  private async saveRestaurant(data: any) {
    console.log('Saving restaurant: ' + data.title)
    const restaurant = new Restaurant()
    await restaurant.create({
      name: data.title,
      description: data.categories && data.categories.join(', '),
      longitude: data.location.longitude,
      latitude: data.location.latitude,
      address: data.location.address,
      city: data.location.city,
      state: '',
      zip: 0,
      image: data.heroImageUrls.length > 0 ? data.heroImageUrls[0].url : '',
    })
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
