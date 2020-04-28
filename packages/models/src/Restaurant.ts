import axios from 'axios'
import { EnumType } from 'json-to-graphql-query'
import _ from 'lodash'

import { Dish, TopCuisineDish } from './Dish'
import { ModelBase, Point, isBrowserProd } from './ModelBase'
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

// TODO: rename to `TopCuisine`?
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

// TODO Merge into TagRestaurantData
export type TagRating = {
  id: string
  rating?: number
  slug: string
  name: string
}

// TODO: Merge tag_rankings and tag_ratings into this
export type TagRestaurantData = TagRating & {
  photos: string[]
}

export type Sources = { [key: string]: { url: string; rating: number } }

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
  tags!: { tag: Tag }[]
  tag_names!: string[]

  // TODO merge all into tag_restaurant_data
  tag_rankings!: (string | number)[][]
  tag_ratings!: TagRating[]
  tag_restaurant_data!: TagRestaurantData[]

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
      'tag_rankings',
      'tag_ratings',
      'tag_restaurant_data',
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
      tags: { tag: Tag.essentialFields() },
    }
  }

  static read_only_fields() {
    return ['is_open_now', 'tags']
  }

  static write_only_fields() {
    return ['tag_names']
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

      if (
        street_address.length > 2 &&
        candidate.address.includes(street_address)
      ) {
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

  async upsertTags(_tags: Partial<Tag>[]) {
    const tags = await Tag.upsertMany(_tags)
    const tag_ids = tags.map((i: Tag) => i.id) as string[]
    await this._upsertTagJunctions(tag_ids)
    await this._updateTagNames(tags)
  }

  async _updateTagNames(tags: Tag[]) {
    const tag_names = _.flatMap(tags.map((tag: Tag) => tag.slugs()))
    this.tag_names = _.uniq([...(this.tag_names || []), ...tag_names])
    await this.update()
  }

  async _upsertTagJunctions(tag_ids: string[]) {
    const objects = tag_ids.map((tag_id) => {
      return {
        restaurant_id: this.id,
        tag_id: tag_id,
      }
    })
    const query = {
      mutation: {
        ['insert_restaurant_tag']: {
          __args: {
            objects: objects,
            on_conflict: {
              constraint: new EnumType('restaurant_tag_pkey'),
              update_columns: [
                new EnumType('restaurant_id'),
                new EnumType('tag_id'),
              ],
            },
          },
          returning: { tag_id: true },
        },
      },
    }
    await ModelBase.hasura(query)
  }

  async _upsertTagRatings(tag_ratings: TagRating[]) {
    const objects = tag_ratings.map((tag) => {
      return {
        restaurant_id: this.id,
        tag_id: tag.id,
        rating: tag.rating,
      }
    })
    const query = {
      mutation: {
        ['insert_restaurant_tag']: {
          __args: {
            objects: objects,
            on_conflict: {
              constraint: new EnumType('restaurant_tag_pkey'),
              update_columns: [
                new EnumType('restaurant_id'),
                new EnumType('tag_id'),
                new EnumType('rating'),
              ],
            },
          },
          returning: { tag_id: true, rating: true },
        },
      },
    }
    await ModelBase.hasura(query)
    this.tag_ratings = tag_ratings
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

  getTagsWithRankings() {
    return this.tags.map((i) => {
      let rank = -1
      const lowered = i.tag.name.toLowerCase()
      const match = (this.tag_rankings || []).find((i) => i[0] == lowered)
      if (match) {
        rank = match[1] as number
      }
      return { icon: i.tag.icon, name: i.tag.name, rank: rank }
    })
  }

  async allPossibleTags() {
    return await Tag.allChildren(this.tags.map((i) => i.tag.id))
  }
}
