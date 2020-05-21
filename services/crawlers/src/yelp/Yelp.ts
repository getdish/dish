import url from 'url'

import { sentryMessage } from '@dish/common'
import { restaurantSaveCanonical, scrapeMergeData } from '@dish/graph'
import { Scrape, ScrapeData } from '@dish/models'
import { ProxiedRequests, WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { aroundCoords, boundingBoxFromcenter, geocode } from '../utils'

const BB_SEARCH = '/search/snippet?cflt=restaurants&l='

const YELP_DOMAIN = 'https://www.yelp.com'

const yelpAPI = new ProxiedRequests(
  YELP_DOMAIN,
  process.env.YELP_AWS_PROXY || YELP_DOMAIN,
  {
    headers: {
      common: {
        'X-My-X-Forwarded-For': 'www.yelp.com',
      },
    },
  }
)

export class Yelp extends WorkerJob {
  current?: string

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
    console.log(
      'Starting Yelp crawler. Using AWS proxy: ' + process.env.YELP_AWS_PROXY
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
    top_right: [number, number],
    bottom_left: [number, number],
    start = 0,
    only = ''
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
    const response = await yelpAPI.get(uri)
    const search_results = response?.data.searchPageProps.searchResultsProps
    const objects = search_results.searchResults
    const pagination = search_results.paginationInfo

    if (!search_results.searchResults) {
      console.error(
        'searchPageProps.searchResultsProps: ',
        response?.data.searchPageProps.searchResultsProps
      )
      throw new Error(
        'YELP: Nothing in `response?.data.searchPageProps.searchResultsProps.searchResults`'
      )
    }
    console.log(
      `YELP: geo search: ${coords}, page ${start}, ${objects.length} results`
    )

    for (const data of objects) {
      if (data?.props?.text?.includes('Sponsored Results')) {
        console.log('YELP: Skipping sponsored result')
        continue
      }
      if (data?.searchResultLayoutType == 'separator') {
        continue
      }
      const name = data.searchResultBusiness.name
      if (only != '' && name != only) {
        console.log('YELP SANDBOX: Skipping ' + name)
        continue
      }
      await this.getRestaurant(data)
    }
    const next_page = start + PER_PAGE
    if (next_page <= pagination.totalResults) {
      await this.runOnWorker('getRestaurants', [
        top_right,
        bottom_left,
        next_page,
        only,
      ])
    }
  }

  async getRestaurant(data: ScrapeData) {
    if (data.searchResultBusiness) {
      let biz_page: string
      const id = await this.saveDataFromMapSearch(data)
      const full_uri = url.parse(data.searchResultBusiness.businessUrl, true)
      if (full_uri.query.redirect_url) {
        biz_page = decodeURI(full_uri.query.redirect_url as string)
      } else {
        biz_page = data.searchResultBusiness.businessUrl
      }
      const biz_page_uri = url.parse(biz_page, true)
      await this.runOnWorker('getEmbeddedJSONData', [id, biz_page_uri.path])
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
    this.current = yelp_path
    console.log(`YELP: getting embedded JSON for: ${yelp_path}`)
    const response = await yelpAPI.get(yelp_path)

    for (const line of response.data.split('\n')) {
      if (line.includes(SIG1) && line.includes(SIG2)) {
        data = this.extractEmbeddedJSONData(line)
        break
      }
    }
    if (!('mapBoxProps' in data)) {
      const message = "YELP: Couldn't extract embedded data"
      sentryMessage(message, { path: yelp_path })
      console.log(message)
      return
    }

    const uri = url.parse(
      data.mapBoxProps.staticMapProps.src.replace(/&amp;/g, '&'),
      true
    )

    const coords = (uri.query.center as string).split(',')
    const lat = parseFloat(coords[0])
    const lon = parseFloat(coords[1])
    let scrape = await scrapeMergeData(id, { data_from_html_embed: data })
    const canonical = await restaurantSaveCanonical(
      lon,
      lat,
      scrape.data.data_from_map_search.name,
      scrape.data.data_from_map_search.formattedAddress
    )
    scrape.location = {
      type: 'Point',
      coordinates: [lon, lat],
    }
    scrape.restaurant_id = canonical.id
    await scrape.update()
    await this.getNextScrapes(id, data)
  }

  async getNextScrapes(id: string, data: ScrapeData) {
    let photo_total = data.photoHeaderProps?.mediaTotal
    if (photo_total > 31 && process.env.DISH_ENV != 'production') {
      photo_total = 31
    }
    const bizId = data.bizContactInfoProps.businessId
    if (photo_total > 0) {
      await this.runOnWorker('getPhotos', [id, bizId, photo_total])
    }
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
    if (data?.photoHeaderProps?.photoFlagReasons)
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
    const YELPS_START_IS_THE_CEILING_OF_THE_PAGE = PER_PAGE
    for (
      let start = YELPS_START_IS_THE_CEILING_OF_THE_PAGE;
      start <= photo_total + PER_PAGE;
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

    const response = await yelpAPI.get(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    const media = response.data.media

    for (let photo of media) {
      delete photo.media_nav_html
      delete photo.selected_media_html
    }

    let photos: { [keys: string]: any } = {}
    photos['photosp' + page] = media
    await scrapeMergeData(id, photos)
    console.log(
      `YELP: ${this.current}, got photo page ${page} with ${media.length} photos`
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

    const response = await yelpAPI.get(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Requested-By-React': true,
      },
    })

    const data = response.data.reviews

    let reviews: ScrapeData = {}
    reviews['reviewsp' + page] = data
    await scrapeMergeData(id, reviews)
    console.log(
      `YELP: ${this.current}, got review page ${page} with ${data.length} reviews`
    )

    if (process.env.DISH_ENV != 'production') {
      console.log('YELP: Exiting review loop, not in production')
      return
    }

    const next_page = start + PER_PAGE
    if (next_page <= response.data.pagination.totalResults) {
      await this.runOnWorker('getReviews', [id, bizId, next_page])
    }
  }
}
