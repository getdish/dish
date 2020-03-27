import _ from 'lodash'

import { ModelBase, Point } from './ModelBase'
import { Dish } from './Dish'
import { Scrape } from './Scrape'
import { Taxonomy } from './Taxonomy'
import { EnumType } from 'json-to-graphql-query'
import { levenshteinDistance } from './utils'

export class Restaurant extends ModelBase<Restaurant> {
  name!: string
  slug!: string
  rating!: number
  address!: string
  location!: Point
  description!: string
  city!: string
  state!: string
  zip!: number
  image?: string
  tags!: { taxonomy: Taxonomy }[]
  tag_names!: string[]
  photos?: string[]
  telephone!: string
  website!: string
  dishes!: Dish[]
  sources!: { [key: string]: string }
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
    return { tags: { taxonomy: { name: true } } }
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

  static async search(
    lat: number,
    lng: number,
    distance: number,
    search_query: string
  ): Promise<Restaurant[]> {
    const query = {
      query: {
        restaurant: {
          __args: {
            where: {
              _or: [
                { name: { _ilike: '%' + search_query + '%' } },
                {
                  tags: {
                    taxonomy: {
                      name: { _eq: search_query },
                    },
                  },
                },
              ],
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
            limit: 25,
            order_by: { rating: new EnumType('desc_nulls_last') },
          },
          id: true,
          ...Restaurant.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data.restaurant.map(
      (data: Partial<Restaurant>) => data
    )
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

  async upsertTags(tags: string[]) {
    this.tag_names = _.uniq([
      ...(this.tag_names || []),
      ...tags.map((t) => t.toLowerCase()),
    ])
    await this.update()
    const objects = tags.map((tag) => {
      return {
        name: tag,
      }
    })
    const query = {
      mutation: {
        ['insert_taxonomy']: {
          __args: {
            objects: objects,
            on_conflict: {
              constraint: new EnumType(Taxonomy.upsert_constraint()),
              update_columns: [new EnumType('name')],
            },
          },
          returning: { id: true },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    const tag_ids = response.data.data['insert_taxonomy'].returning.map(
      (i: Taxonomy) => i.id
    )
    await this.upsertTagJunctions(tag_ids)
    return tag_ids
  }

  async upsertTagJunctions(tag_ids: string[]) {
    const objects = tag_ids.map((tag_id) => {
      return {
        restaurant_id: this.id,
        taxonomy_id: tag_id,
      }
    })
    const query = {
      mutation: {
        ['insert_restaurant_taxonomy']: {
          __args: {
            objects: objects,
            on_conflict: {
              constraint: new EnumType('restaurant_taxonomy_pkey'),
              update_columns: [
                new EnumType('restaurant_id'),
                new EnumType('taxonomy_id'),
              ],
            },
          },
          returning: { taxonomy_id: true },
        },
      },
    }
    await ModelBase.hasura(query)
  }

  async delete() {
    await Restaurant.deleteAllBy('id', this.id)
  }

  static allPhotos(restaurant: Restaurant) {
    return (
      [restaurant.image, ...(restaurant.photos ?? [])].filter(Boolean) ?? []
    )
  }
}
