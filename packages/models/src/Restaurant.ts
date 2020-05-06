import auth from '@dish/auth'
import axios from 'axios'
import { EnumType } from 'json-to-graphql-query'
import _ from 'lodash'

import { Dish, TopCuisineDish } from './Dish'
import { ModelBase, Point, isBrowserProd } from './ModelBase'
import { RestaurantTag, RestaurantTagWithID } from './RestaurantTag'
import { Scrape } from './Scrape'
import { Tag } from './Tag'
import { levenshteinDistance } from './utils'

let SEARCH_DOMAIN: string
const isNode = typeof window == 'undefined'
const isWorker = !isNode && !!window['isWorker']
const LIVE_SEARCH_DOMAIN = 'https://search.rio.dishapp.com'
const LOCAL_SEARCH_DOMAIN = 'http://localhost:10000'

if (isWorker) {
  SEARCH_DOMAIN = LIVE_SEARCH_DOMAIN
} else if (isNode) {
  SEARCH_DOMAIN = LOCAL_SEARCH_DOMAIN
} else {
  if (isBrowserProd || window.location.hostname.includes('hasura_live')) {
    SEARCH_DOMAIN = LIVE_SEARCH_DOMAIN
  } else {
    SEARCH_DOMAIN = LOCAL_SEARCH_DOMAIN
  }
}

export type LngLat = { lng: number; lat: number }

export type TopCuisine = {
  country: string
  icon: string
  frequency: number
  avg_rating: number
  dishes: TopCuisineDish[]
  top_restaurants: Partial<Restaurant>[]
}

export type RestaurantSearchArgs = {
  center: LngLat
  span: LngLat
  query: string
  tags?: string[]
  limit?: number
}

export type RatingFactors = {
  food: number
  service: number
  value: number
  ambience: number
}

export type CarouselPhoto = {
  src: string
  name?: string
  rating?: number
}

export type Sources = { [key: string]: { url: string; rating: number } }

export type UnifiedTag = {
  tag: Tag
} & RestaurantTag

export class Restaurant extends ModelBase<Restaurant> {
  name!: string
  slug!: string
  rating!: number
  rating_factors!: RatingFactors
  address!: string
  location!: Point
  description!: string
  city!: string
  state!: string
  zip!: number
  image?: string
  tags!: UnifiedTag[]
  tag_names!: string[]
  photos?: string[]
  telephone!: string
  website!: string
  dishes!: Dish[]
  sources!: Sources
  hours!: { [key: string]: any }[]
  is_open_now!: boolean
  price_range!: string

  static model_name() {
    return 'Restaurant'
  }

  static fields() {
    return [
      'name',
      'slug',
      'rating',
      'rating_factors',
      'address',
      'location',
      'description',
      'city',
      'state',
      'zip',
      'image',
      'tags',
      'tag_names',
      'photos',
      'telephone',
      'website',
      'sources',
      'hours',
      'is_open_now',
      'price_range',
    ]
  }

  static sub_fields() {
    return {
      tags: {
        tag: Tag.fieldsAsObject(),
        ...RestaurantTag.essentialFields(),
      },
    }
  }

  static read_only_fields() {
    return ['is_open_now', 'tags']
  }

  static write_only_fields() {
    if (auth.is_admin) {
      return []
    } else {
      return ['tag_names']
    }
  }

  static upsert_constraint() {
    return 'restaurant_name_address_key'
  }

  // Note that there is no unit or reference point for these values. All that
  // matters is simply the relative differences between them. For example therefore
  // there is no need to ensure that the maximum value is 1.0 or 100%.
  static WEIGHTS = {
    yelp: 0.6,
    tripadvisor: 0.6,
    michelin: 1.0,
    infatuated: 0.9,
    ubereats: 0.2,
  }

  async findOne(key: string, value: string, extra_returning: {} = {}) {
    extra_returning = {
      dishes: {
        ...Dish.fieldsAsObject(),
      },
    }
    return await super.findOne(key, value, extra_returning)
  }

  static async fetchBatch(
    size: number,
    previous_id: string,
    extra_returning: {} = {},
    extra_where: {} = {}
  ) {
    let restaurant = new Restaurant()
    return await restaurant.fetchBatch(
      Restaurant,
      size,
      previous_id,
      extra_returning,
      extra_where
    )
  }

  static async findNear(lat: number, lng: number, distance: number) {
    const query = {
      query: {
        restaurant: {
          __args: {
            where: {
              location: {
                _st_d_within: {
                  distance: distance,
                  from: {
                    type: 'Point',
                    coordinates: [lng, lat],
                  },
                },
              },
            },
          },
          ...Restaurant.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data.restaurant.map(
      (data: Partial<Restaurant>) => new Restaurant(data)
    )
  }

  static async search({
    center: { lat: lat, lng: lng },
    span,
    query,
    tags = [],
    limit = 25,
  }: RestaurantSearchArgs): Promise<Restaurant[]> {
    const params = [
      'query=' + query,
      'lon=' + lng,
      'lat=' + lat,
      'span_lon=' + span.lng,
      'span_lat=' + span.lat,
      `limit=${limit}`,
      'tags=' + tags.map((t) => t.toLowerCase().trim()).join(','),
    ]
    const url = SEARCH_DOMAIN + '/search?' + params.join('&')
    const response = await axios.get(url)
    return response.data.map(
      (data: Partial<Restaurant>) => new Restaurant(data)
    )
  }

  static async getHomeDishes(
    lat: number,
    lng: number,
    distance: number
  ): Promise<TopCuisine[]> {
    const params = ['lon=' + lng, 'lat=' + lat, 'distance=' + distance]
    const response = await axios.get(
      SEARCH_DOMAIN + '/top_dishes?' + params.join('&')
    )
    return response.data
  }

  async getLatestScrape(source: string) {
    const query = {
      query: {
        scrape: {
          __args: {
            where: {
              restaurant_id: {
                _eq: this.id,
              },
              source: {
                _eq: source,
              },
            },
            order_by: {
              updated_at: new EnumType('desc'),
            },
            limit: 1,
          },
          ...Scrape.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return new Scrape(response.data.data.scrape[0])
  }

  static async saveCanonical(
    lon: number,
    lat: number,
    name: string,
    street_address: string
  ) {
    const nears = await Restaurant.findNear(lat, lon, 0.0005)
    let found: Restaurant | undefined = undefined
    for (const candidate of nears) {
      if (
        candidate.location.coordinates[0] == lon &&
        candidate.location.coordinates[1] == lat
      ) {
        found = candidate
        break
      }

      if (levenshteinDistance(candidate.name, name) <= 3) {
        found = candidate
        break
      }
    }
    if (found) {
      if (process.env.RUN_WITHOUT_WORKER != 'true') {
        console.log('Found existing canonical restaurant: ' + found.id)
      }
      return found
    }
    const restaurant = new Restaurant({
      name: name,
      address: street_address,
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    })
    await restaurant.insert()
    if (process.env.RUN_WITHOUT_WORKER != 'true') {
      console.log('Created new canonical restaurant: ' + restaurant.id)
    }
    return restaurant
  }

  getRestaurantTagFromTag(tag_id: string) {
    const existing = (this.tags || []).find((i) => {
      return i.tag.id == tag_id
    })
    let rt = {} as RestaurantTag
    if (existing) {
      const cloned = _.cloneDeep(existing)
      delete cloned.tag
      rt = cloned
    }
    rt.tag_id = tag_id
    return rt
  }

  async upsertManyTags(restaurant_tags: RestaurantTagWithID[]) {
    const populated = restaurant_tags.map((rt) => {
      const existing = this.getRestaurantTagFromTag(rt.tag_id)
      return { ...existing, ...rt }
    })
    RestaurantTag.upsertMany(this.id, populated)
    await this.refresh()
  }

  async upsertTagRestaurantData(restaurant_tags: RestaurantTagWithID[]) {
    await this.upsertManyTags(restaurant_tags)
    await this._updateTagNames()
  }

  async upsertOrphanTags(tag_strings: string[]) {
    const tags = tag_strings.map((tag_name) => {
      return new Tag({
        name: tag_name,
      })
    })
    const full_tags = await Tag.upsertMany(tags)
    const restaurant_tags = full_tags.map((tag: Tag) => {
      return {
        tag_id: tag.id,
      }
    })
    await this.upsertTagRestaurantData(restaurant_tags)
  }

  async _updateTagNames() {
    await this.refresh()
    const tag_names = _.flatMap(this.tags.map((i) => new Tag(i.tag).slugs()))
    this.tag_names = _.uniq([...(this.tag_names || []), ...tag_names])
    await this.update()
  }

  async delete() {
    await Restaurant.deleteAllBy('id', this.id)
  }

  static allPhotos(restaurant: Restaurant) {
    return (
      [restaurant.image, ...(restaurant.photos ?? [])].filter(Boolean) ?? []
    )
  }

  async allPossibleTags() {
    return await Tag.allChildren(
      this.tags.map((i) => {
        return i.tag.id
      })
    )
  }

  photosForCarousel() {
    let photos = [] as CarouselPhoto[]
    const max_photos = 4
    for (const t of this.tags || []) {
      const photo = (t.photos || [])[0]
      if (!photo) continue
      let photo_name = t.tag.name || ' '
      if (t.tag.icon) {
        photo_name = t.tag.icon + photo_name
      }
      photos.push({
        name: photo_name,
        src: photo,
        rating: t.rating,
      })
      if (photos.length >= max_photos) break
    }
    for (const photo of this.photos || []) {
      photos.push({ name: ' ', src: photo })
      if (photos.length >= max_photos) break
    }
    return photos
  }

  bestTagPhotos() {
    return this.tags
      ?.filter((t) => (t.photos?.length || 0) > 0 && t.rating)
      .sort((t1, t2) => (t2.rating || 0) - (t1.rating || 0))
  }
}
