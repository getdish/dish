import url from 'url'

import { sleep } from '@dish/async'
import { sentryMessage } from '@dish/common'
import { Restaurant, ZeroUUID, query, resolved } from '@dish/graph'
import { decode } from '@dish/helpers-node'
import { ProxiedRequests, WorkerJob } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { DISH_DEBUG } from '../constants'
import { YelpDetailPageData, YelpPhotosData, YelpScrapeData } from '../fixtures/fixtures'
import {
  Scrape,
  ScrapeData,
  scrapeFindOneBySourceID,
  scrapeInsert,
  scrapeMergeData,
  scrapeUpdateBasic,
} from '../scrape-helpers'
import { aroundCoords, boundingBoxFromCenter, geocode } from '../utils'

type RestaurantMatching = Required<Pick<Restaurant, 'name' | 'address' | 'telephone'>>

export type YelpScrape = Scrape<YelpScrapeData>

const BB_SEARCH = '/search/snippet?cflt=restaurants&l='
const YELP_DOMAIN = 'https://www.yelp.com'
const YELP_DOMAIN_MOBILE = 'https://m.yelp.com'

const yelpAPI = new ProxiedRequests(YELP_DOMAIN, process.env.YELP_AWS_PROXY || YELP_DOMAIN, {
  headers: {
    'X-My-X-Forwarded-For': 'www.yelp.com',
  },
})

const yelpAPIMobile = new ProxiedRequests(
  YELP_DOMAIN_MOBILE,
  process.env.YELP_MOBILE_AWS_PROXY || YELP_DOMAIN_MOBILE,
  {
    headers: {
      'X-My-X-Forwarded-For': 'm.yelp.com',
    },
  }
)

export class Yelp extends WorkerJob {
  current?: string
  find_only: RestaurantMatching | null = null

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

  async crawlSingle(slug: string) {
    const rest = await resolved(() => {
      return query
        .restaurant({
          where: {
            slug: {
              _eq: slug,
            },
          },
        })
        .map((x) => {
          return {
            name: x.name,
            id: x.id,
            slug: x.slug,
            address: x.address,
            location: x.location,
            sources: x.sources,
          }
        })[0]
    })
    if (!rest?.name) {
      this.log('not found, no name')
      return
    }
    const mv = 0.001
    const [lng, lat] = rest.location?.coordinates ?? []
    if (lng && lat) {
      try {
        await this.getRestaurants(
          [lat - mv, lng - mv],
          [lat + mv, lng + mv],
          0,
          // @ts-ignore
          rest
        )
      } catch (err) {
        this.log('Error finding by searching for exact location, switch to general search')
        // @ts-ignore
        await this.refindRestaurant(rest)
      }
    } else {
      this.log(`no lng or lat ${rest.location}`)
      // @ts-ignore
      await this.refindRestaurant(rest)
    }
  }

  async refindRestaurant(rest: Restaurant) {
    if (!rest.address) {
      this.log(`No address`)
      return
    }
    const addrs = rest.address.split(', ')
    const city = addrs.slice(addrs.length - 2, addrs.length).join(', ')
    const name = decode(rest.name).replace(/[^a-z0-9]/, '')
    // prettier-ignore
    const searchUrl = `/search_suggest/v2/prefetch?loc=${encodeURIComponent(city)}&loc_name_param=loc&is_new_loc=&prefix=${encodeURIComponent(name)}&is_initial_prefetch=`
    this.log(`Searching for restaurant ${YELP_DOMAIN + searchUrl}`)
    const res = await yelpAPI.getJSON(searchUrl)
    const suggestions = res?.response?.flatMap((x) => x.suggestions)
    if (!suggestions) {
      throw new Error(`No response: ${JSON.stringify(res || null)}`)
    }
    const yelpUrl = rest.sources?.yelp?.url
    const street = decode(addrs.slice(0, addrs.length - 2).join(', ')).toLowerCase()
    this.log('check for match', yelpUrl, street, JSON.stringify(suggestions))
    const found = suggestions.find((x) => {
      if (yelpUrl) {
        return yelpUrl.includes(x.redirect_url)
      }
      if (street) {
        // subtitle is the street address
        return street.includes(decode(x.subtitle).toLowerCase())
      }
      return false
    })
    if (!found) {
      this.log(`not found anymore, may be closed?`)
      return
    }
    const mv = 0.0025
    const [lat, lng] = await geocode(found.subtitle)
    this.log('found new coords, try again at', JSON.stringify({ lat, lng }))
    await this.getRestaurants(
      [lat - mv, lng - mv],
      [lat + mv, lng + mv],
      0,
      rest as RestaurantMatching
    )
  }

  async allForCity(city_name: string) {
    this.log(`Starting on city "${city_name}". Using AWS proxy: ${process.env.YELP_AWS_PROXY}`)
    const MAPVIEW_SIZE = 4000
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(aroundCoords(coords[0], coords[1], MAPVIEW_SIZE, 6))
    const longest_radius = (MAPVIEW_SIZE * Math.sqrt(2)) / 2
    for (const box_center of region_coords) {
      const bounding_box = boundingBoxFromCenter(box_center[0], box_center[1], longest_radius)
      await this.runOnWorker('getRestaurants', [bounding_box[0], bounding_box[1], 0])
    }
  }

  async getRestaurants(
    top_right: readonly [number, number],
    bottom_left: readonly [number, number],
    start = 0,
    onlyRestaurant: RestaurantMatching | null = null
  ) {
    const PER_PAGE = 30
    const coords = [top_right[1], top_right[0], bottom_left[1], bottom_left[0]].join(',')
    const bb = encodeURIComponent('g:' + coords)
    const uri = BB_SEARCH + bb + '&start=' + start
    const response = await yelpAPI.getJSON(uri)
    if (!response) {
      this.log('no response!', response)
      return []
    }
    // console.log('got', response)
    const componentsList = response.searchPageProps.mainContentComponentsListProps ?? []
    const pagination = componentsList.find((x) => x.type === 'pagination')

    if (!pagination) {
      this.log('no pagination', componentsList)
    }

    let found_the_one = false
    this.find_only = onlyRestaurant

    if (!componentsList.length) {
      console.error('searchPageProps.searchResultsProps: ', uri, response)
      throw new Error('Nothing in `response.searchPageProps.searchResultsProps.searchResults`')
    }

    const validResults = componentsList.filter((data) => {
      if (data?.props?.text?.includes('Sponsored Results')) {
        return false
      }
      if (data?.searchResultLayoutType == 'separator') {
        return false
      }
      return true
    })

    this.log(`geo search: ${coords}, page ${start}, ${validResults.length} results`)

    let toCrawl: any[] = []

    if (!onlyRestaurant) {
      toCrawl = validResults
    } else {
      const findOne = (strategy = 'strict') => {
        if (toCrawl.length) return
        for (const data of validResults) {
          const info = data.searchResultBusiness
          if (isMatchingRestaurant(info, onlyRestaurant, strategy as any)) {
            // prettier-ignore
            this.log(`YELP SANDBOX: found ${info.name} ${strategy} - scrape (${info.formattedAddress} ${info.phone} ${info.name}) restaurant (${onlyRestaurant.address} ${onlyRestaurant.telephone} ${onlyRestaurant.name})`)
            toCrawl = [data]
            found_the_one = true
            break
          }
        }
      }
      findOne('strict')
      findOne('fuzzy')
    }

    if (!toCrawl.length) {
      console.log('none found!')
      return
    }

    console.log('got crawlable results', JSON.stringify(toCrawl, null, 2))

    for (const data of toCrawl) {
      const timeout = sleep(100_000)
      await Promise.race([
        this.processRestaurant(data),
        timeout.then(() => {
          console.warn('Timed out getting restaurant', name)
        }),
      ])
      timeout.cancel()
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

    if (onlyRestaurant) {
      if (!found_the_one) {
        // prettier-ignore
        this.log('error componentsList\n', ` > ${YELP_DOMAIN}${uri}\n`, componentsList?.length)
        throw new Error(`Couldn't find ${onlyRestaurant.name}`)
      }
    }

    this.log('done with getRestaurants')
  }

  async processRestaurant(data: any) {
    if (!data.searchResultBusiness) {
      console.warn('no data.searchResultBusiness')
      return
    }
    const id = await scrapeInsert({
      source: 'yelp',
      restaurant_id: ZeroUUID,
      location: {
        lat: 0,
        lon: 0,
      },
      id_from_source: data.bizId,
      data: {
        data_from_search_list_item: data.searchResultBusiness,
      },
    })
    this.log('Inserting scrape data for scrape id', id, 'bizId', data.bizId)
    if (!id) {
      throw new Error(`No id`)
    }
    let bizUrl = data.searchResultBusiness.businessUrl as string
    const fullUrl = url.parse(bizUrl, true)
    if (fullUrl.query.redirect_url) {
      bizUrl = decodeURI(fullUrl.query.redirect_url as string)
    }
    // lets use mobile!
    bizUrl = bizUrl.replace('www.', 'm.')
    console.log('bizUrl', bizUrl)
    const bizUrlParsed = url.parse(bizUrl, true)
    await this.runOnWorker('getEmbeddedJSONData', [id, bizUrlParsed.path, data.bizId])
  }

  async getEmbeddedJSONData(id: string, yelp_path: string, id_from_source: string) {
    this.current = yelp_path
    this.log(`getting embedded JSON for: ${yelp_path}`)
    const [[dynamicIn], ldjsonsIn] = await yelpAPIMobile.getScriptData(yelp_path, [
      'script[data-hypernova-key*="__mobile_site__Biz__dynamic"]',
      'script[type*="application/ld+json"]',
    ])

    if (!dynamicIn) {
      console.log('error, got', { dynamicIn, ldjsonsIn })
      throw new Error(`No extraction found`)
    }

    if (!('legacyProps' in dynamicIn)) {
      if (process.env.NODE_ENV !== 'production') {
        // prettier-ignore
        console.log('no legacyProps in\n', JSON.stringify(dynamicIn, null, 2))
      }
      sentryMessage("Error Couldn't extract embedded data", {
        data: { path: yelp_path },
        logger: this.log,
      })
      return
    }

    const dynamic = dynamicIn as YelpDetailPageData['dynamic']
    // clean just a bit
    delete dynamic['messages']

    const json = ldjsonsIn.filter(Boolean).find((x) => x['@type'] === 'Restaurant') as
      | YelpDetailPageData['json']
      | undefined

    if (!json) {
      console.log('error no Restaurant schema data found', { json, ldjsonsIn })
      return
    }

    this.log(`merge scrape data: ${yelp_path}`)
    const scrape = (await scrapeMergeData(id, { dynamic, json }))! as YelpScrape

    const { mapState } = scrape.data.dynamic.legacyProps.props.directionsModalProps
    const { latitude, longitude } = mapState.center
    const restaurant_id = await restaurantSaveCanonical(
      'yelp',
      id_from_source,
      longitude,
      latitude,
      scrape.data.data_from_search_list_item.name,
      scrape.data.data_from_search_list_item.formattedAddress
    )
    if (this.find_only) {
      this.log(`ID for ${this.find_only.name} is ${restaurant_id}`)
    }
    scrape.location = {
      lon: longitude,
      lat: latitude,
    }
    scrape.restaurant_id = restaurant_id
    await scrapeUpdateBasic(scrape)
    await this.getNextScrapes(id, scrape)
    if (DISH_DEBUG > 1) {
      const data = await scrapeFindOneBySourceID('yelp', id_from_source)
      this.log(`Scrape:`, JSON.stringify(data, null, 2))
    }
  }

  static getNameAndAddress(scrape: YelpScrape) {
    return {
      name: scrape.data.data_from_search_list_item.name,
      address: scrape.data.data_from_search_list_item.formattedAddress,
    }
  }

  async getNextScrapes(id: string, scrape: YelpScrape) {
    // console.log('got', JSON.stringify(scrape.data, null, 2))
    const photoGrid = scrape.data.dynamic.legacyProps.props.modules.serverModules.flatMap((x) =>
      x.component === 'PhotoGrid' ? x : []
    )[0]?.props
    let photoTotal = (photoGrid.mediaCount as number) ?? 0
    this.log(`getNextScrapes photoTotal ${photoTotal}`)
    if (photoTotal > 31 && process.env.DISH_ENV == 'test') {
      photoTotal = 31
    }
    const bizId = scrape.id_from_source
    if (photoTotal > 0) {
      await this.runOnWorker('getPhotos', [id, bizId, photoTotal])
    }
    await this.runOnWorker('getReviews', [id, bizId])
  }

  async getPhotos(id: string, bizId: string, photoTotal: number) {
    const PER_PAGE = 30
    const YELPS_START_IS_THE_CEILING_OF_THE_PAGE = PER_PAGE
    for (
      let start = YELPS_START_IS_THE_CEILING_OF_THE_PAGE;
      start <= photoTotal + PER_PAGE;
      start += PER_PAGE
    ) {
      await this.runOnWorker('getPhotoPage', [id, bizId, start, Math.floor(start / PER_PAGE) - 1])
    }
  }

  async getPhotoPage(id: string, bizId: string, start: number, page: number) {
    // https://m.yelp.com/biz_photos/qs7FgJ-UXgpbAMass0Oojg/get_photos?start=14&dir=b
    const url = '/biz_photos/' + bizId + '/get_photos' + '?start=' + start + '&dir=b'
    const response: YelpPhotosData = await yelpAPIMobile.getJSON(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    const media = response.media
    let photos: { [keys: string]: any } = {}
    photos['dishpage-' + page] = media
      .filter((x) => x.src_high_res)
      .map((item) => ({
        url: item.src_high_res!.replace('348s', '1000s'),
        caption: item.caption,
      }))
    await scrapeMergeData(id, { photos })
    this.log(`${this.current}, got photo page ${page} with ${media.length} photos`)
  }

  async getReviews(id: string, bizId: string, start: number = 0) {
    const PER_PAGE = 20
    const page = start / PER_PAGE
    const url = '/biz/' + bizId + '/review_feed?rl=en&sort_by=relevance_desc&q=&start=' + start
    const response = await yelpAPI.getJSON(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Requested-By-React': 'true',
      },
    })
    const data = response.reviews
    let reviews: ScrapeData = {}
    reviews['dishpage-' + page] = data
    await scrapeMergeData(id, { reviews })
    this.log(`${this.current}, got review page ${page} with ${data.length} reviews`)

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

function isMatchingRestaurant(
  data,
  restaurant: RestaurantMatching,
  exactness: 'fuzzy' | 'strict' = 'strict'
) {
  if (exactness !== 'strict') {
    const similarAddress =
      data.formattedAddress && restaurant.address?.includes(data.formattedAddress)
    const samePhone = restaurant.telephone === data.phone
    const similarName = data?.name.includes(restaurant.name) || restaurant.name?.includes(data.name)
    return (
      (similarName && samePhone) || (similarName && similarAddress) || (similarAddress && samePhone)
    )
  }
  if (restaurant.name === data.name) {
    return data.formattedAddress === restaurant.address
  }
  return false
}
