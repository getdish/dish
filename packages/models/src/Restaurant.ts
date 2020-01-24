import { ModelBase, MapSchema } from './ModelBase'
import { FIELDS_SCHEMA as DISH_SCHEMA } from './Dish'

export const FIELDS_SCHEMA = ModelBase.asSchema({
  id: 'string',
  name: 'string',
  description: 'string',
  location: 'point',
  address: 'string',
  city: 'string',
  state: 'string',
  zip: 'integer',
  image: 'string',
})
type RestaurantFields = MapSchema<typeof FIELDS_SCHEMA>

export class Restaurant extends ModelBase {
  data!: RestaurantFields

  constructor() {
    super(FIELDS_SCHEMA)
  }

  async upsert(data: RestaurantFields) {
    this.data = data
    const query = `mutation {
      insert_restaurant(
        objects: ${this.stringify(this.data)},
        on_conflict: {
          constraint: restaurant_name_address_key,
          update_columns: ${this.fields()}
        }
      ) {
        returning {
          name, id
        }
      }
    }`
    return await this.hasura(query)
  }

  async find(key: string, value: string) {
    const response_fields = this.fields_bare()
    const dishes = Object.keys(DISH_SCHEMA)
    const query = `query {
      restaurant(where: {${key}: {_eq: "${value}"}}) {
        ${response_fields}
        dishes {${dishes}}
      }
    }`
    return await this.hasura(query)
  }

  async delete_all() {
    const query = `mutation {
      delete_restaurant(where: {id: {_neq: ""}}) {
        returning { id }
      }
    }`
    return await this.hasura(query)
  }

  static async findNear(lat: number, lng: number, distance: number) {
    const self = new Restaurant()
    const response_fields = self.fields_bare()
    const dishes = Object.keys(DISH_SCHEMA)
    const query = `query {
      restaurant ( where: { location: { _st_d_within: {
        distance: ${distance},
        from: { type: "Point",
          coordinates: [${lng}, ${lat}]
        }
      }}})
        {
          ${response_fields}
          dishes {${dishes}}
        }
    }`
    return await self.hasura(query)
  }

  static async allRestaurantsCount() {
    const self = new Restaurant()
    const query = `{
      restaurant_aggregate {
        aggregate {
          count
        }
      }
    }`
    return await self.hasura(query)
  }
}
