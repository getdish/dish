import '@dish/common'

import { restaurantSaveCanonical, scrapeInsert } from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { aroundCoords, geocode } from '../utils'

const GRUBHUB_DOMAIN =
  process.env.GRUBHUB_AWS_PROXY || 'https://api-gtm.grubhub.com/'

const axios = axios_base.create({
  baseURL: GRUBHUB_DOMAIN,
  headers: {
    common: {
      'Content-Type': 'application/json',
    },
  },
})

export class GrubHub extends WorkerJob {
  auth_token: string = ''
  // I assume the reasoning for the map view size for a delivery service is,
  // what is the minimum radius that a restaurant will deliver to?
  public MAPVIEW_SIZE = 2000
  public SEARCH_RADIUS_MULTIPLIER = 5

  static queue_config: QueueOptions = {
    limiter: {
      max: 3,
      duration: 5000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForCity(city_name: string) {
    console.log('Starting GrubHub crawler. Using domain: ' + GRUBHUB_DOMAIN)
    let all: string[] = []
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
      const restaurants = await this.search(coords[0], coords[1])
      const ids = restaurants.map((r) => r.restaurant_id)
      all = [...all, ...ids]
    }
    console.log(`GRUBHUB: Found ${all.length} restaurants`)
    for (const id of all) {
      await this.runOnWorker('getRestaurant', [id])
    }
  }

  async getAuthToken() {
    const response = await axios.post('auth', {
      brand: 'GRUBHUB',
      client_id: 'beta_UmWlpstzQSFmocLy3h1UieYcVST',
      scope: 'anonymous',
    })
    this.auth_token = response.data.session_handle.access_token
  }

  async apiRequest(path: string) {
    if (!this.auth_token ?? this.auth_token == '') {
      await this.getAuthToken()
    }
    const response = await axios.get(path, {
      headers: {
        Authorization: 'Bearer ' + this.auth_token,
      },
    })
    return response.data
  }

  async search(lat: number, lng: number) {
    let page = 1
    let results: any[] = []
    let all: any[] = []
    while (page == 1 || results.length > 0) {
      console.log(`DOORDASH: searching at ${lng}, ${lat}`)
      let path = this._getSearchPath(lat, lng, page)
      const response = await this.apiRequest(path)
      const results = response.search_result.results
      all = [...all, ...results]
      page += 1
    }
    return all
  }

  async getRestaurant(id: string) {
    const path = this._getRestaurantPath(id)
    const response = await this.apiRequest(path)
    const data = response.restaurant
    const lng = parseFloat(data.longitude)
    const lat = parseFloat(data.latitude)
    const canonical = await restaurantSaveCanonical(
      lng,
      lat,
      data.name,
      data.address.street_address
    )
    await scrapeInsert([
      {
        source: 'grubhub',
        restaurant_id: canonical.id,
        id_from_source: data.id,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
        data: {
          main: data,
          reviews: await this.getReviews(data.id),
        },
      },
    ])
    return data
  }

  async getReviews(id: string) {
    let page = 1
    let reviews: any[] = []
    let all: any[] = []
    while (page == 1 || reviews.length > 0) {
      const path = this._getReviewsPath(id)
      const response = await this.apiRequest(path)
      const reviews = response.reviews.review
      all = [...all, ...reviews]
      page += 1
    }
    return all
  }

  _getRestaurantPath(id: string) {
    return (
      `restaurants/${id}?` +
      `hideChoiceCategories=true&version=4&variationId=rtpFreeItems&orderType=standard` +
      `&hideUnavailableMenuItems=true&hideMenuItems=false&includePromos=false` +
      `&locationMode=delivery`
    )
  }

  _getSearchPath(lat: number, lng: number, page: number = 1) {
    return (
      `restaurants/search?` +
      `orderMethod=delivery&locationMode=DELIVERY` +
      `&facetSet=umamiV2&pageSize=100&hideHateos=true&searchMetrics=true` +
      `&location=POINT(${lng}%20${lat})` +
      `&preciseLocation=true&geohash=9q8yy1z6xg4q` +
      `&includeOffers=true&sortSetId=umamiv3&sponsoredSize=3` +
      `&countOmittingTimes=true&pageNum=${page}`
    )
  }

  _getReviewsPath(id: string, page: number = 1) {
    const page_size = 100
    return (
      `ratings/search/restaurant/${id}` +
      `?pageSize=${page_size}&pageNum=${page}&brand=GRUBHUB&` +
      `facet=order_type%3Astandard&timeCreated_desc`
    )
  }
}
