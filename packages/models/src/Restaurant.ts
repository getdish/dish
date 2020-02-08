import { ModelBase, Point } from './ModelBase'
import { Dish } from './Dish'

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
          dishes: {
            ...Dish.fieldsAsObject(),
          },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data.restaurant.map(
      (data: Partial<Restaurant>) => new Restaurant(data)
    )
  }
}
