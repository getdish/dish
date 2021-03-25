import url from 'url'

import { sleep } from '@dish/async'
import { sentryMessage } from '@dish/common'
import { Restaurant, ZeroUUID } from '@dish/graph'
import { ProxiedRequests, WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import {
  ScrapeData,
  scrapeInsert,
  scrapeMergeData,
  scrapeUpdateBasic,
} from '../scrape-helpers'
import { aroundCoords, boundingBoxFromcenter, geocode } from '../utils'

const BB_SEARCH = '/search/snippet?cflt=restaurants&l='
const YELP_DOMAIN = 'https://www.yelp.com'

const yelpAPI = new ProxiedRequests(
  YELP_DOMAIN,
  process.env.YELP_AWS_PROXY || YELP_DOMAIN,
  {
    headers: {
      'X-My-X-Forwarded-For': 'www.yelp.com',
    },
  }
)

export class Yelp extends WorkerJob {
  current?: string
  find_only: Restaurant | null = null

  static queue_config: QueueOptions = {
    limiter: {
      max: 5,
      duration: 300,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  get logName() {
    return `Yelp ${this.current || this.find_only?.name || '...'}`
  }

  async allForCity(city_name: string) {
    this.log(
      `Starting on city "${city_name}". Using AWS proxy: ${process.env.YELP_AWS_PROXY}`
    )
    const MAPVIEW_SIZE = 4000
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(
      aroundCoords(coords[0], coords[1], MAPVIEW_SIZE, 6)
    )
    const longest_radius = (MAPVIEW_SIZE * Math.sqrt(2)) / 2
    for (const box_center of region_coords) {
      const bounding_box = boundingBoxFromcenter(
        box_center[0],
        box_center[1],
        longest_radius
      )
      await this.runOnWorker('getRestaurants', [
        bounding_box[0],
        bounding_box[1],
        0,
      ])
    }
  }

  async getRestaurants(
    top_right: readonly [number, number],
    bottom_left: readonly [number, number],
    start = 0,
    onlyRestaurant: Restaurant | null = null
  ) {
    const PER_PAGE = 30
    const coords = [
      top_right[1],
      top_right[0],
      bottom_left[1],
      bottom_left[0],
    ].join(',')
    const bb = encodeURIComponent('g:' + coords)
    const uri = BB_SEARCH + bb + '&start=' + start
    const response = await yelpAPI.getJSON(uri)
    if (!response) {
      this.log('no response!', response)
      return []
    }
    const componentsList =
      response.searchPageProps.mainContentComponentsListProps ?? []
    const pagination = componentsList.find((x) => x.type === 'pagination')

    if (!pagination) {
      this.log('no pagination', componentsList)
    }

    let found_the_one = false
    this.find_only = onlyRestaurant

    if (!componentsList.length) {
      console.error('searchPageProps.searchResultsProps: ', uri, response)
      throw new Error(
        'Nothing in `response.searchPageProps.searchResultsProps.searchResults`'
      )
    }
    this.log(
      `geo search: ${coords}, page ${start}, ${componentsList.length} results`
    )

    for (const data of componentsList) {
      if (data?.props?.text?.includes('Sponsored Results')) {
        this.log('Skipping sponsored result')
        continue
      }
      if (data?.searchResultLayoutType == 'separator') {
        continue
      }

      const info = data.searchResultBusiness
      const name = info.name
      if (onlyRestaurant) {
        if (!isMatchingRestaurant(info, onlyRestaurant)) {
          this.log('YELP SANDBOX: Skipping ' + name)
          continue
        }
        found_the_one = true
        this.log('YELP SANDBOX: found ' + name)
      }
      const timeout = sleep(35000)
      await Promise.race([
        this.getRestaurant(data),
        timeout.then(() => {
          console.warn('Timed out getting restaurant', name)
        }),
      ])
      timeout.cancel()
      if (found_the_one) {
        break
      }
    }

    this.log('done with getRestaurants page')

    if (pagination && !found_the_one) {
      const next_page = start + PER_PAGE
      if (next_page <= pagination.totalResults) {
        await this.runOnWorker('getRestaurants', [
          top_right,
          bottom_left,
          next_page,
          onlyRestaurant,
        ])
      }
    }

    if (onlyRestaurant && !found_the_one) {
      this.log('error componentsList', uri, componentsList)
      throw new Error(`Couldn't find ${onlyRestaurant.id}`)
    }

    this.log('done with getRestaurants')
  }

  async getRestaurant(data: ScrapeData) {
    if (!data.searchResultBusiness) {
      console.warn('no data.searchResultBusiness')
      return
    }
    let biz_page: string
    this.log('Inserting scrape data')
    const id = await this.saveDataFromMapSearch(data)
    if (!id) {
      throw new Error(`No id`)
    }
    const full_uri = url.parse(data.searchResultBusiness.businessUrl, true)
    if (full_uri.query.redirect_url) {
      biz_page = decodeURI(full_uri.query.redirect_url as string)
    } else {
      biz_page = data.searchResultBusiness.businessUrl
    }
    const biz_page_uri = url.parse(biz_page, true)
    await this.runOnWorker('getEmbeddedJSONData', [
      id,
      biz_page_uri.path,
      data.bizId,
    ])
  }

  async saveDataFromMapSearch(data: ScrapeData) {
    const id = await scrapeInsert({
      source: 'yelp',
      restaurant_id: ZeroUUID,
      location: {
        lat: 0,
        lon: 0,
      },
      id_from_source: data.bizId,
      data: {
        data_from_map_search: data.searchResultBusiness,
      },
    })
    return id
  }

  async getEmbeddedJSONData(
    id: string,
    yelp_path: string,
    id_from_source: string
  ) {
    this.current = yelp_path
    this.log(`getting embedded JSON for: ${yelp_path}`)
    const response = await yelpAPI.getHyperscript(
      yelp_path,
      'script[data-hypernova-key*="BizDetailsApp"]'
    )
    const data = this.extractEmbeddedJSONData(response)
    if (!data) {
      throw new Error(`No extraction found`)
    }

    if (!('mapBoxProps' in data)) {
      const message = "Error Couldn't extract embedded data"
      this.log(message)
      sentryMessage(message, { path: yelp_path })
      return
    }

    const uri = url.parse(
      data.mapBoxProps.staticMapProps.src.replace(/&amp;/g, '&'),
      true
    )
    const coords = (uri.query.center as string).split(',')
    const lat = parseFloat(coords[0])
    const lon = parseFloat(coords[1])
    this.log(`merge scrape data: ${yelp_path}`)
    const scrape = (await scrapeMergeData(id, { data_from_html_embed: data }))!
    const restaurant_id = await restaurantSaveCanonical(
      'yelp',
      id_from_source,
      lon,
      lat,
      scrape.data.data_from_map_search.name,
      scrape.data.data_from_map_search.formattedAddress
    )
    if (this.find_only) {
      this.log(`ID for ${this.find_only.name} is ${restaurant_id}`)
    }
    scrape.location = {
      lon: lon,
      lat: lat,
    }
    scrape.restaurant_id = restaurant_id
    await scrapeUpdateBasic(scrape)
    await this.getNextScrapes(id, data)
  }

  static getNameAndAddress(scrape: ScrapeData) {
    return {
      name: scrape.data.data_from_map_search.name,
      address: scrape.data.data_from_map_search.formattedAddress,
    }
  }

  async getNextScrapes(id: string, data: ScrapeData) {
    let photoTotal = data.photoHeaderProps?.mediaTotal ?? 0
    this.log(`getNextScrapes photoTotal ${photoTotal}`)
    if (photoTotal > 31 && process.env.DISH_ENV == 'test') {
      photoTotal = 31
    }
    const bizId = data.bizContactInfoProps.businessId
    if (photoTotal > 0) {
      await this.runOnWorker('getPhotos', [id, bizId, photoTotal])
    }
    await this.runOnWorker('getReviews', [id, bizId])
  }

  extractEmbeddedJSONData(obj: { [key: string]: any }) {
    const json = obj.bizDetailsPageProps
    if (json) {
      let data: { [keys: string]: any } = {}
      const required_fields = [
        'bizHoursProps',
        'mapBoxProps',
        'moreBusinessInfoProps',
        'bizContactInfoProps',
        'photoHeaderProps',
      ]
      for (const key of Object.keys(json)) {
        if (required_fields.includes(key)) {
          data[key] = json[key]
        }
      }
      if (data?.photoHeaderProps?.photoFlagReasons) {
        delete data.photoHeaderProps.photoFlagReasons
      }
      data = this.numericKeysFix(data)
      return data
    }
    return null
  }

  numericKeysFix(data: { [key: string]: any }) {
    if (data.ratingDetailsProps) {
      data.ratingDetailsProps.monthlyRatingsByYear = escape(
        JSON.stringify(data.ratingDetailsProps.monthlyRatingsByYear)
      )
    }
    return data
  }

  async getPhotos(id: string, bizId: string, photoTotal: number) {
    const PER_PAGE = 30
    const YELPS_START_IS_THE_CEILING_OF_THE_PAGE = PER_PAGE
    for (
      let start = YELPS_START_IS_THE_CEILING_OF_THE_PAGE;
      start <= photoTotal + PER_PAGE;
      start += PER_PAGE
    ) {
      await this.runOnWorker('getPhotoPage', [
        id,
        bizId,
        start,
        Math.floor(start / PER_PAGE) - 1,
      ])
    }
  }

  async getPhotoPage(id: string, bizId: string, start: number, page: number) {
    const url =
      '/biz_photos/get_media_slice/' + bizId + '?start=' + start + '&dir=b'
    const response = await yelpAPI.getJSON(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    const media = response.media
    for (let photo of media) {
      delete photo.media_nav_html
      delete photo.selected_media_html
    }
    let photos: { [keys: string]: any } = {}
    photos['photosp' + page] = media
    await scrapeMergeData(id, photos)
    this.log(
      `${this.current}, got photo page ${page} with ${media.length} photos`
    )
  }

  async getReviews(id: string, bizId: string, start: number = 0) {
    const PER_PAGE = 20
    const page = start / PER_PAGE

    const url =
      '/biz/' +
      bizId +
      '/review_feed?rl=en&sort_by=relevance_desc&q=&start=' +
      start

    const response = await yelpAPI.getJSON(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Requested-By-React': 'true',
      },
    })

    const data = response.reviews
    let reviews: ScrapeData = {}
    reviews['reviewsp' + page] = data
    await scrapeMergeData(id, reviews)
    this.log(
      `${this.current}, got review page ${page} with ${data.length} reviews`
    )

    if (process.env.DISH_ENV == 'test') {
      this.log('Exiting review loop, in test')
      return
    }

    const next_page = start + PER_PAGE
    if (next_page <= response.pagination.totalResults) {
      await this.runOnWorker('getReviews', [id, bizId, next_page])
    }
  }
}

function isMatchingRestaurant(data, restaurant: Restaurant) {
  if (restaurant.address?.includes(data.formattedAddress)) {
    return true
  }
  if (restaurant.telephone === data.phone) {
    return true
  }
  if (restaurant.name === data.name) {
    return true
  }
  return false
}
