import { ModelBase, Point } from './ModelBase'
import { Dish } from './Dish'
import { Scrape } from './Scrape'
import { EnumType } from 'json-to-graphql-query'
import { levenshteinDistance } from './utils'
import { log } from 'util'

export class Restaurant extends ModelBase<Restaurant> {
  name!: string
  address!: string
  location!: Point
  description!: string
  city!: string
  state!: string
  zip!: number
  image!: string
  dishes!: Dish[]

  static model_name() {
    return 'Restaurant'
  }

  static fields() {
    return [
      'name',
      'address',
      'location',
      'description',
      'city',
      'state',
      'zip',
      'image',
    ]
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

  static async getLatestScrape(source: string, match: {}) {
    const query = {
      query: {
        scrape: {
          __args: {
            where: {
              data: {
                _contains: match,
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
    lat: number,
    lon: number,
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
      console.log('Found existing canonical restaurant: ' + found.id)
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
    console.log('Created new canonical restaurant: ' + restaurant.id)
    return restaurant
  }
}
