import ModelBase from './ModelBase'

type RestaurantFields = {
  name: string
  description: string
  longitude: number
  latitude: number
  address: string
  city: string
  state: string
  zip: number
  image: string
}

export class Restaurant extends ModelBase {
  data!: RestaurantFields

  async create(data: RestaurantFields) {
    this.data = data
    const query = `mutation {
      insert_restaurant(
        objects: ${this.stringify(this.data)},
        on_conflict: {
          constraint: restaurant_name_address_key,
          update_columns: ${this.stringify(Object.keys(this.data))}
        }
      ) {
        returning {
          name
        }
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
}
