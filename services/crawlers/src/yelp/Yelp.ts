import url from 'url'

import { sleep } from '@dish/async'
import { sentryMessage } from '@dish/common'
import { Restaurant, ZeroUUID, query, resolved } from '@dish/graph'
import { decode } from '@dish/helpers-node'
import { ProxiedRequests, WorkerJob, fetchBrowserScriptData } from '@dish/worker'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { restaurantSaveCanonical } from '../canonical-restaurant'
import { DISH_DEBUG } from '../constants'
import { YelpDetailPageData, YelpScrapeData } from '../fixtures/fixtures'
import {
  Scrape,
  ScrapeData,
  scrapeFindOneBySourceID,
  scrapeInsert,
  scrapeMergeData,
  scrapeUpdateBasic,
} from '../scrape-helpers'
import { aroundCoords, boundingBoxFromCenter, geocode } from '../utils'
import { FixAddressBug } from './fix_address_bug'

type RestaurantMatching = Required<Pick<Restaurant, 'name' | 'address' | 'telephone'>>

export type YelpScrape = Scrape<YelpScrapeData>

export const YELP_DOMAIN = 'https://www.yelp.com'
export const YELP_DOMAIN_MOBILE = 'https://m.yelp.com'

export const yelpAPI = new ProxiedRequests(YELP_DOMAIN, process.env.YELP_AWS_PROXY || YELP_DOMAIN, {
  headers: {
    'X-My-X-Forwarded-For': 'www.yelp.com',
  },
  timeout: null,
})

export const yelpAPIMobile = new ProxiedRequests(
  YELP_DOMAIN_MOBILE,
  process.env.YELP_MOBILE_AWS_PROXY || YELP_DOMAIN_MOBILE,
  {
    headers: {
      'X-My-X-Forwarded-For': 'm.yelp.com',
    },
    timeout: null,
  }
)

export class Yelp extends WorkerJob {
  current_biz_path?: string
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
    return `Yelp ${this.current_biz_path || this.find_only?.name || '...'}`
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
        await this.getRestaurants({
          top_right: [lat - mv, lng - mv],
          bottom_left: [lat + mv, lng + mv],
          start: 0,
          onlyRestaurant: rest as any,
        })
      } catch (err) {
        this.log(
          'Error finding by searching for exact location, switch to general search',
          err.message,
          err.stack
        )
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
    const name = decode(rest.name).replace(/[^a-z0-9]/gi, '')
    // prettier-ignore
    const searchUrl = `/search_suggest/v2/prefetch?loc=${encodeURIComponent(city)}&loc_name_param=loc&is_new_loc=&prefix=${encodeURIComponent(name)}&is_initial_prefetch=`
    this.log(`Searching for restaurant ${YELP_DOMAIN + searchUrl}`)
    const res: any = await yelpAPI.getJSON(searchUrl)
    const suggestions = res?.response?.flatMap((x: any) => x.suggestions)
    if (!suggestions) {
      throw new Error(`No response: ${JSON.stringify(res || null)}`)
    }
    const yelpUrl = rest.sources?.yelp?.url
    const street = decode(addrs.slice(0, addrs.length - 2).join(', ')).toLowerCase()
    this.log('check for match', yelpUrl, street, JSON.stringify(suggestions))
    const found = suggestions.find((x: any) => {
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
    await this.getRestaurants({
      top_right: [lat - mv, lng - mv],
      bottom_left: [lat + mv, lng + mv],
      start: 0,
      onlyRestaurant: rest as RestaurantMatching,
    })
  }

  async allForCity(city_name: string) {
    this.log(`Starting on city "${city_name}". Using AWS proxy: ${process.env.YELP_AWS_PROXY}`)
    const MAPVIEW_SIZE = 4000
    const coords = await geocode(city_name)
    const region_coords = _.shuffle(aroundCoords(coords[0], coords[1], MAPVIEW_SIZE, 6))
    const longest_radius = (MAPVIEW_SIZE * Math.sqrt(2)) / 2
    for (const box_center of region_coords) {
      const bounding_box = boundingBoxFromCenter(box_center[0], box_center[1], longest_radius)
      await this.runOnWorker('getRestaurants', [
        {
          top_right: bounding_box[0],
          bottom_left: bounding_box[1],
          start: 0,
        },
      ])
    }
  }

  async getRestaurants({
    top_right,
    bottom_left,
    start = 0,
    onlyRestaurant = null,
    // comma seems to work!
    category = 'food,restaurants',
  }: {
    top_right: [number, number]
    bottom_left: [number, number]
    start: number
    onlyRestaurant: RestaurantMatching | null
    category?: 'all' | 'food' | 'restaurants' | 'food,restaurants'
  }) {
    const coords = [top_right[1], top_right[0], bottom_left[1], bottom_left[0]].join(',')
    const bb = encodeURIComponent('g:' + coords)
    const uri = `/search/snippet?cflt=${category}&l=${bb}&start=${start}`
    const response: any = await yelpAPI.getJSON(uri)
    if (!response) {
      this.log('no response!', response)
      return []
    }
    const componentsList = response.searchPageProps.mainContentComponentsListProps ?? []
    const pagination = componentsList.find((x: any) => x.type === 'pagination')

    if (!pagination) {
      this.log('no pagination', componentsList)
    }

    let found_the_one = false
    this.find_only = onlyRestaurant

    if (!componentsList.length) {
      console.error('searchPageProps.searchResultsProps: ', uri, response)
      throw new Error('Nothing in `response.searchPageProps.searchResultsProps.searchResults`')
    }

    const validResults = componentsList.filter((data: any) => {
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
      this.log(
        `looking for specific restaurant based on ${onlyRestaurant.name} ${onlyRestaurant.address} ${onlyRestaurant.telephone}`
      )
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
      findOne('name')
    }

    if (!toCrawl.length) {
      console.log(
        'none found!',
        validResults.map((x: any) => x?.searchResultBusiness?.name).join(', ')
      )
      return
    }

    this.log('got crawlable results', toCrawl.length)

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
      // yelp returns results per page in weird location here, use that or fallback to 10
      const perPage = componentsList.find((x: any) => x?.props?.resultsPerPage) ?? 10
      const next_page = start + perPage
      if (next_page <= pagination.totalResults) {
        await this.runOnWorker('getRestaurants', [
          { top_right, bottom_left, next_page, onlyRestaurant },
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
    this.log('bizUrl', bizUrl)
    const bizUrlParsed = url.parse(bizUrl, true)
    this.log(`RUN_WITHOUT_WORKER=${process.env.RUN_WITHOUT_WORKER}`)
    await this.runOnWorker('getEmbeddedJSONData', [id, bizUrlParsed.path, data.bizId])
  }

  async getEmbeddedJSONData(id: string, yelp_path: string, id_from_source: string) {
    this.current_biz_path = yelp_path
    this.log(`getting embedded JSON for: ${yelp_path}`)
    // @ts-ignore
    const [dynamicIns, ldjsonsIn] = await yelpAPIMobile.getScriptData(yelp_path, [
      'script[data-hypernova-key*="__mobile_site__Biz__dynamic"]',
      'script[type*="application/ld+json"]',
    ])
    const [dynamicIn] = dynamicIns

    if (!dynamicIn) {
      console.log('error, got', { dynamicIns, dynamicIn, ldjsonsIn })
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

    const jsonByType = ldjsonsIn
      .filter(Boolean)
      .find((x: any) => x['@type'] === 'Restaurant' || x['@type'] === 'LocalBusiness')
    const json: YelpDetailPageData['json'] | null = jsonByType || ldjsonsIn[1] || null

    if (!json) {
      console.log('error no schema data found', { json, ldjsonsIn })
      return
    }

    this.log(`merge scrape data: ${yelp_path}`)
    const scrape = (await scrapeMergeData(id, { dynamic, json, yelp_path }))! as YelpScrape

    const { mapState } = scrape.data.dynamic.legacyProps.props.directionsModalProps
    const { latitude, longitude } = mapState.center
    const restaurant_id = await restaurantSaveCanonical(
      'yelp',
      id_from_source,
      longitude,
      latitude,
      scrape.data.data_from_search_list_item.name,
      Yelp.getNameAndAddress(scrape).address
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
    if (DISH_DEBUG > 2) {
      const data = await scrapeFindOneBySourceID('yelp', id_from_source)
      this.log(`Scrape:`, JSON.stringify(data, null, 2))
    }
  }

  static getNameAndAddress(scrape: YelpScrape) {
    const parts = scrape.data.json.address
    const address = [
      parts.streetAddress,
      parts.addressLocality,
      parts.addressRegion,
      parts.postalCode,
      parts.addressCountry,
    ]
      .filter(Boolean)
      .join(', ')

    return {
      name: scrape.data.data_from_search_list_item.name,
      address,
    }
  }

  async getNextScrapes(id: string, scrape: YelpScrape) {
    // console.log('got', JSON.stringify(scrape.data, null, 2))
    const photoGrid = scrape.data.dynamic.legacyProps.props.modules.serverModules.flatMap((x) =>
      x.component === 'PhotoGrid' ? x : []
    )[0]?.props
    let photoTotal = (photoGrid.mediaCount as number) ?? 0
    this.log(`getNextScrapes photoTotal ${photoTotal}`)
    if (photoTotal > 31 && process.env.NODE_ENV == 'test') {
      photoTotal = 31
    }
    const bizId = scrape.id_from_source
    if (photoTotal > 0) {
      await this.runOnWorker('getPhotos', [
        id,
        scrape.data.yelp_path.replace('/biz/', ''),
        photoTotal,
      ])
    }
    await this.runOnWorker('getReviews', [id, bizId])
  }

  async getPhotos(id: string, slug: string, photoTotal: number) {
    const PER_PAGE = 30
    const pagesTotal = Math.ceil(photoTotal / PER_PAGE)
    let pages = [...new Array(pagesTotal).fill(0)].map((_, i) => i)
    this.log(`getPhotos pages ${pages.join(', ')}`)
    for (const page of pages) {
      await this.runOnWorker('getPhotoPage', [id, slug, page * PER_PAGE, page])
    }
  }

  async getPhotoPage(id: string, slug: string, start: number, page: number) {
    if (page > 2 && process.env.DISH_ENV === 'test') {
      console.log('test mode exit after first page')
      return
    }
    // this is removed :(
    // https://m.yelp.com/biz_photos/qs7FgJ-UXgpbAMass0Oojg/get_photos?start=14&dir=b
    const url = `${YELP_DOMAIN}/biz_photos/${slug}?start=${start}`
    this.log(`getting photo page ${url}`)
    //'/biz_photos/' + bizId + '/get_photos' + '?start=' + start + '&dir=b'
    const response: any = await fetchBrowserScriptData(url, ['[data-photo-id]'])
    const items = response.flat()

    const data: { url: string; caption: string }[] = []

    for (const item of items) {
      if (!item || typeof item !== 'string') {
        continue
      }
      const url = (item.match(/src="([^"]+)"/)?.[1] ?? '').replace(/\/[0-9]+s.jpg/, '/1000s.jpg')
      // if no url or exists already ignore
      if (!url || data.find((x) => x.url === url)) {
        continue
      }
      const caption = item.match(/alt="Photo of[^\.]+\. ([^\"]+)"/)?.[1] ?? ''
      data.push({
        url: url,
        caption: decode(caption.trim()),
      })
    }
    if (DISH_DEBUG > 3) {
      console.log(`Got photos`, data)
    }

    const photos: { [keys: string]: any } = {}
    photos['photosp' + page] = data
    await scrapeMergeData(id, photos)
    this.log(`got photo page ${page} with ${data.length} photos`)
  }

  async getReviews(id: string, bizId: string, start = 0) {
    const PER_PAGE = 10
    const page = start / PER_PAGE
    const url = '/biz/' + bizId + '/review_feed?rl=en&sort_by=relevance_desc&q=&start=' + start
    const response: any = await yelpAPI.getJSON(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'X-Requested-By-React': 'true',
      },
      timeout: null,
    })
    const data = response.reviews
    let reviews: ScrapeData = {}
    reviews['reviewsp' + page] = data
    await scrapeMergeData(id, reviews)
    this.log(`${this.current_biz_path}, got review page ${page} with ${data.length} reviews`)

    if (process.env.NODE_ENV == 'test' && page > 1) {
      this.log('Exiting review loop early in test mode')
      return
    }

    const next_page = start + PER_PAGE
    if (next_page <= response.pagination.totalResults) {
      await this.runOnWorker('getReviews', [id, bizId, next_page])
    }
  }

  async _reGeocodeScrapes() {
    await FixAddressBug.reGeocodeScrapes(this)
  }
  async _reGeocodeOneScrape(id: string) {
    await FixAddressBug.reGeocodeOneScrape(id)
  }
}

function isMatchingRestaurant(
  data: any,
  restaurant: RestaurantMatching,
  exactness: 'fuzzy' | 'strict' | 'name' = 'strict'
) {
  const similarName = isSimilar(restaurant.name, data?.name)
  if (exactness === 'name') {
    return similarName
  }
  const similarAddress = isSimilar(data.formattedAddress, restaurant?.address)
  const similarPhone = isSimilar(restaurant.telephone, data.phone)
  if (exactness !== 'strict') {
    return (
      (similarName && similarPhone) ||
      (similarName && similarAddress) ||
      (similarAddress && similarPhone)
    )
  }
  if (similarName) {
    return data.formattedAddress === restaurant.address
  }
  return false
}

// TODO could use levenshtein
const isSimilar = (a?: string | null, b?: string | null) => {
  const ac = stripExtraChars(a ?? '')
  const bc = stripExtraChars(b ?? '')
  return ac.includes(bc) || bc.includes(ac)
}

const stripExtraChars = (str: string) => str.replace(/[^a-z0-9]/gi, '')
