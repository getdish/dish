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

  async upsert() {
    const query = `mutation {
      insert_restaurant(
        objects: ${this.asObject()},
        on_conflict: {
          constraint: restaurant_name_address_key,
          update_columns: ${Restaurant.fieldsSerialized()}
        }
      ) {
        returning {
          id, created_at, updated_at, ${Restaurant.fieldsBare()}
        }
      }
    }`

    const response = await ModelBase.hasura(query)
    let data: Restaurant
    if (typeof response.data.data.insert_restaurant != 'undefined') {
      data = response.data.data.insert_restaurant.returning[0]
    } else {
      data = response.data.data.restaurant[0]
    }

    Object.assign(this, data)
    return this.id
  }

  static async findOne(key: string, value: string) {
    const query = `query {
      restaurant(where: {${key}: {_eq: "${value}"}}) {
        id ${Restaurant.fieldsBare()}
        dishes {${Dish.fieldsBare()}}
      }
    }`
    const response = await ModelBase.hasura(query)
    const restaurants = response.data.data.restaurant
    if (restaurants.length == 1) {
      const restaurant = new Restaurant(restaurants[0])
      return restaurant
    } else {
      throw new Error(restaurants.length + ' restaurants found by findOne()')
    }
  }

  static async deleteOne(name: string) {
    const query = `mutation {
      delete_restaurant(where: {name: {_eq: "${name}"}}) {
        returning { id }
      }
    }`
    return await ModelBase.hasura(query)
  }

  static async findNear(lat: number, lng: number, distance: number) {
    const query = `query {
      restaurant ( where: { location: { _st_d_within: {
        distance: ${distance},
        from: { type: "Point",
          coordinates: [${lng}, ${lat}]
        }
      }}})
        {
          id ${Restaurant.fieldsBare()}
          dishes {${Dish.fieldsBare()}}
        }
    }`
    const response = await ModelBase.hasura(query)
    return response.data.data.restaurant.map(
      (data: Partial<Restaurant>) => new Restaurant(data)
    )
  }

  static async allRestaurantsCount() {
    const query = `{
      restaurant_aggregate {
        aggregate {
          count
        }
      }
    }`
    const response = await ModelBase.hasura(query)
    return response.data.data.restaurant_aggregate.aggregate.count
  }
}
