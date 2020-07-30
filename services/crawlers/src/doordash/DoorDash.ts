import '@dish/common'

import { restaurantSaveCanonical } from '@dish/graph'
import { WorkerJob } from '@dish/worker'
import axios_base from 'axios'
import { JobOptions, QueueOptions } from 'bull'
import _ from 'lodash'

import { scrapeInsert } from '../scrape-helpers'
import { aroundCoords, geocode } from '../utils'

type BasicStore = {
  id: string
  lat: number
  lng: number
}

const DOORDASH_DOMAIN =
  process.env.DOORDASH_GRAPHQL_AWS_PROXY ||
  'https://api-consumer-client.doordash.com/'

const axios = axios_base.create({
  baseURL: DOORDASH_DOMAIN + 'graphql',
  headers: {
    common: {
      'Content-Type': 'application/json',
    },
  },
})

export class DoorDash extends WorkerJob {
  cookie: string = ''
  // I assume the reasoning for the map view size for a delivery service is,
  // what is the minimum radius that a restaurant will deliver to?
  public MAPVIEW_SIZE = 2000
  public SEARCH_RADIUS_MULTIPLIER = 5

  static queue_config: QueueOptions = {
    limiter: {
      max: 1,
      duration: 1500,
    },
  }

  static job_config: JobOptions = {
    attempts: 3,
  }

  async allForCity(city_name: string) {
    let stores: { [id: string]: BasicStore } = {}
    console.log('Starting DoorDash crawler. Using domain: ' + DOORDASH_DOMAIN)
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
      const new_stores = await this.search(coords[0], coords[1])
      for (const id of Object.keys(new_stores)) {
        stores[id] = new_stores[id]
      }
      if (process.env.RUN_WITHOUT_WORKER == 'true') {
        if (Object.keys(stores).length > 0) break
      }
    }
    console.log(
      `DoorDash ${Object.keys(stores).length} store IDs found for ${city_name}`
    )
    for (const id of Object.keys(stores)) {
      await this.runOnWorker('getStore', [stores[id]])
    }
  }

  async getCookie() {
    const response = await axios.post('?operation=bootstrap', {
      operationName: 'viewstate',
      variables: {},
      query: 'query viewstate {viewstate {id experiments __typename}}',
    })
    const dd_guest_id = response.headers['set-cookie'].find((c) =>
      c.includes('dd_guest_id')
    )
    this.cookie = dd_guest_id.split(';')[0].split('=')[1]
  }

  async graphRequest(graphql: any) {
    if (!this.cookie || this.cookie == '') {
      await this.getCookie()
    }
    const response = await axios.post('/', graphql, {
      headers: {
        Cookie: 'dd_guest_id=' + this.cookie,
      },
    })
    return response.data.data
  }

  async search(lat: number, lng: number) {
    let is_more = true
    let stores: { [id: string]: BasicStore } = {}
    let page = 0
    console.log(`DoorDash searching at: ${lat}, ${lng}`)
    while (is_more) {
      const response = await this.graphRequest(this._searchGQL(lat, lng, page))
      const results = response.storeSearch.stores
      if (results.length > 0) {
        for (const store of results) {
          stores[store.id] = {
            id: store.id,
            lat: store.location.lat,
            lng: store.location.lng,
          }
        }
        page += 1
      } else {
        is_more = false
      }
    }
    return stores
  }

  async getStore(store: BasicStore) {
    const response = await this.graphRequest(this._getStoreGQL(store.id))
    const main = response.storeInformation
    if (process.env.RUN_WITHOUT_WORKER != 'true') {
      console.info('DoorDash: saving "' + main.name + '"')
    }
    const canonical = await restaurantSaveCanonical(
      store.lng,
      store.lat,
      main.name,
      main.address.printableAddress
    )
    const id = await scrapeInsert({
      source: 'doordash',
      restaurant_id: canonical.id,
      id_from_source: main.id,
      location: {
        lon: store.lng,
        lat: store.lat,
      },
      data: {
        main,
        menus: response.storeMenus,
        storeMenuSeo: response.storeMenuSeo,
      },
    })
    return id
  }

  _searchGQL(lat: number, lng: number, page: number = 0) {
    const PER_PAGE = 500
    const offset = page * PER_PAGE
    return {
      operationName: 'storeSearch',
      variables: {
        searchLat: lat,
        searchLng: lng,
        offset: offset,
        limit: PER_PAGE,
        searchQuery: null,
        filterQuery: null,
        categoryQueryId: null,
      },
      query: `query storeSearch(
           $offset: Int!,
           $limit: Int!,
           $order: [String!],
           $searchQuery: String,
           $filterQuery: String,
           $categoryQueryId: ID,
           $searchLat: Float,
           $searchLng: Float
        ) {
          storeSearch(
            offset: $offset,
            limit: $limit,
            order: $order,
            searchQuery: $searchQuery,
            filterQuery: $filterQuery,
            categoryQueryId: $categoryQueryId,
            searchLat: $searchLat,
            searchLng: $searchLng
          ) {
            numStores
            stores {
              id
              name
              description
              averageRating
              numRatings
              priceRange
              featuredCategoryDescription
              deliveryFee
              extraSosDeliveryFee
              displayDeliveryFee
              headerImgUrl
              url
              menus {
                popularItems {
                  imgUrl
                }
              }
              status {
                unavailableReason
              }
              location {
                lat
                lng
              }
            }
            storeItems {
              id
              name
              price
              imageUrl
              store {
                name
                url
                id
              }
            }
          }
        }`,
    }
  }

  _getStoreGQL(id: string) {
    return {
      operationName: 'menu',
      variables: {
        storeId: id,
        locale: 'en-US',
        ddffWebHomepageCmsBanner: true,
        isStorePageFeedMigration: false,
      },
      query: `query
        menu(
          $storeId: ID!,
          $menuId: ID,
          $ddffWebHomepageCmsBanner: Boolean,
          $locale: String,
          $isStorePageFeedMigration: Boolean!
        ) {
          ... @skip(if: $isStorePageFeedMigration) {
            storeInformation(storeId: $storeId) {
              id
              name
              isGoodForGroupOrders
              offersPickup
              offersDelivery
              deliveryFee
              sosDeliveryFee
              numRatings
              averageRating
              shouldShowStoreLogo
              isActive
              isConsumerSubscriptionEligible
              coverImgUrl
              coverSquareImgUrl
              businessHeaderImgUrl
              distanceFromConsumer
              distanceFromConsumerInMeters
              providesExternalCourierTracking
              fulfillsOwnDeliveries
              isInDemandTest
              isDeliverableToConsumerAddress
              business {
                id
                name
                link
              }
              businessVertical
              address {
                street
                printableAddress
                city
                state
                country
                cityLink
              }
              status {
                asapAvailable
                asapMinutesRange
              }
              storeDisclaimers {
                id
                disclaimerDetailsLink
                disclaimerLinkSubstring
                disclaimerText
                displayTreatment
              }
            }
            storeMenus(storeId: $storeId, menuId: $menuId) {
              allMenus {
                id
                name
                subtitle
                isBusinessEnabled
                timesOpen
              }
              currentMenu {
                id
                timesOpen
                hoursToOrderInAdvance
                isCatering
                minOrderSize
                menuCategories {
                  ...StoreMenuCategoryFragment
                  items {
                    ...StoreMenuListItemFragment
                  }
                }
              }
            }
          }
          storeCrossLinks(storeId: $storeId) {
            trendingStores {
              ...StoreCrossLinkItemFragment
            }
            trendingCategories {
              ...StoreCrossLinkItemFragment
            }
            topCuisinesNearMe {
              ...StoreCrossLinkItemFragment
            }
            nearbyCities {
              ...StoreCrossLinkItemFragment
            }
          }
          storeMenuSeo(storeId: $storeId, menuId: $menuId)
          consumerCmsDetails(
            placement: "store",
            storeId: $storeId,
            ddffWebHomepageCmsBanner: $ddffWebHomepageCmsBanner,
            locale: $locale
          ) {
            banner {
              isActive
              campaignId
              promoCode
              description {
                copy
                color
              }
              modal {
                description
                label
                terms
              }
              url
              backgroundColor
              desktopImage
              mobileImage
              opensModal
              action
              label {
                copy
                color
              }
            }
          }
        }
        fragment StoreMenuCategoryFragment on StoreMenuCategory {
          id
          subtitle
          title
        }
        fragment StoreMenuListItemFragment on StoreMenuListItem {
          id
          description
          isTempDeactivated
          price
          imageUrl
          name
        }
        fragment StoreCrossLinkItemFragment on StoreCrossLinkItem {
          name
          url
        }`,
    }
  }
}
