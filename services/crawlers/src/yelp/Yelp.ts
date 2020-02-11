import '@dish/common'

import _ from 'lodash'
import axios_base from 'axios'
import { QueueOptions, JobOptions } from 'bull'

import { WorkerJob } from '@dish/worker'
import { Scrape, ScrapeData } from '@dish/models'

import { aroundCoords, boundingBoxFromCentre, geocode } from '../utils'

const YELP_DOMAIN = process.env.YELP_PROXY || 'https://www.yelp.com'
const BB_SEARCH = '/search/snippet?cflt=restaurants&l='

const axios = axios_base.create({
  baseURL: YELP_DOMAIN,
  headers: {
    common: {
      'X-My-X-Forwarded-For': 'www.yelp.com',
    },
  },
})

console.log('Starting Yelp crawler. Using domain: ' + YELP_DOMAIN)

export class Yelp extends WorkerJob {
  static queue_config: QueueOptions = {
    limiter: {
      max: 1,
      duration: 1000,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForCity(city_name: string) {
    const MAPVIEW_SIZE = 5000
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(
      aroundCoords(coords[0], coords[1], MAPVIEW_SIZE, 5)
    )
    const longest_radius = (MAPVIEW_SIZE * Math.sqrt(2)) / 2
    for (const box_centre of region_coords) {
      const bounding_box = boundingBoxFromCentre(
        box_centre[0],
        box_centre[1],
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
    top_right: [number, number],
    bottom_left: [number, number],
    start: number = 0
  ) {
    const PER_PAGE = 30
    const coords = [
      top_right[1],
      top_right[0],
      bottom_left[1],
      bottom_left[0],
    ].join(',')
    const bb = encodeURIComponent('g:' + coords)
    const uri = YELP_DOMAIN + BB_SEARCH + bb + '&start=' + start
    const response = await axios.get(uri)
    const search_results = response.data.searchPageProps.searchResultsProps
    const objects = search_results.searchResults
    const pagination = search_results.paginationInfo
    for (const data of objects) {
      await this.getRestaurant(data)
    }
    const next_page = start + PER_PAGE
    if (next_page <= pagination.totalResults) {
      await this.runOnWorker('getRestaurants', [
        top_right,
        bottom_left,
        next_page,
      ])
    }
  }

  async getRestaurant(data: ScrapeData) {
    if (data.searchResultBusiness) {
      const id = await this.saveDataFromMapSearch(data)
      await this.runOnWorker('getEmbeddedJSONData', [
        id,
        data.searchResultBusiness.businessUrl,
      ])
    }
  }

  async saveDataFromMapSearch(data: ScrapeData) {
    let scrape = new Scrape({
      source: 'yelp',
      id_from_source: data.bizId,
      data: {
        data_from_map_search: data.searchResultBusiness,
      },
    })
    await scrape.insert()
    return scrape.id
  }

  async getEmbeddedJSONData(id: string, yelp_path: string) {
    let data: { [keys: string]: any } = {}
    const SIG1 = '<script type="application/json" data-hypernova-key'
    const SIG2 = 'mapBoxProps'
    const response = await axios.get(yelp_path)

    for (const line of response.data.split('\n')) {
      if (line.includes(SIG1) && line.includes(SIG2)) {
        data = this.extractEmbeddedJSONData(line)
        break
      }
    }
    await Scrape.mergeData(id, { data_from_html_embed: data })
    await this.getNextScrapes(id, data)
  }

  async getNextScrapes(id: string, data: ScrapeData) {
    let photo_total = data.photoHeaderProps.mediaTotal
    if (process.env.DISH_ENV != 'production') {
      photo_total = 31
    }
    const bizId = data.bizContactInfoProps.businessId
    await this.runOnWorker('getPhotos', [id, bizId, photo_total])
    await this.runOnWorker('getReviews', [id, bizId])
  }

  extractEmbeddedJSONData(line: string) {
    const match = line.match(/<!\-\-([\w\s\S]+?)\-\->/)![1]
    const json = JSON.parse(match).bizDetailsPageProps
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
    delete data.photoHeaderProps.photoFlagReasons
    data = this.numericKeysFix(data)
    return data
  }

  numericKeysFix(data: { [key: string]: any }) {
    if (data.ratingDetailsProps) {
      data.ratingDetailsProps.monthlyRatingsByYear = escape(
        JSON.stringify(data.ratingDetailsProps.monthlyRatingsByYear)
      )
    }
    return data
  }

  async getPhotos(id: string, bizId: string, photo_total: number) {
    const PER_PAGE = 30
    for (let start = PER_PAGE; start <= photo_total; start += PER_PAGE) {
      await this.runOnWorker('getPhotoPage', [
        id,
        bizId,
        start,
        start / PER_PAGE,
      ])
    }
  }

  async getPhotoPage(id: string, bizId: string, start: number, page: number) {
    console.log('Getting photo page: ' + page)

    const url =
      YELP_DOMAIN +
      '/biz_photos/get_media_slice/' +
      bizId +
      '?start=' +
      start +
      '&dir=b'

    const response = await axios.get(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    for (let photo of response.data.media) {
      delete photo.media_nav_html
      delete photo.selected_media_html
    }

    let photos: { [keys: string]: any } = {}
    photos['photosp' + page] = response.data.media
    await Scrape.mergeData(id, photos)
  }

  async getReviews(id: string, bizId: string, start: number = 0) {
    const PER_PAGE = 20
    const page = start / PER_PAGE
    console.log('Getting review page: ' + page)

    const url =
      YELP_DOMAIN +
      '/biz/' +
      bizId +
      '/review_feed?rl=en&sort_by=relevance_desc&q=&start=' +
      start

    const response = await axios.get(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Requested-By-React': true,
      },
    })

    let reviews: ScrapeData = {}
    reviews['reviewsp' + page] = response.data.reviews
    await Scrape.mergeData(id, reviews)

    for (let review of response.data.reviews) {
      delete review.lightboxMediaItems
    }

    if (process.env.DISH_ENV != 'production') {
      return
    }

    const next_page = start + PER_PAGE
    if (next_page <= response.data.pagination.totalResults) {
      await this.runOnWorker('getReviews', [id, bizId, next_page])
    }
  }
}
