import { ModelBase, MapSchema } from './ModelBase'

const FIELDS_SCHEMA = ModelBase.asSchema({
  name: 'string',
  description: 'string',
  image: 'string',
})
type DishFields = MapSchema<typeof FIELDS_SCHEMA>

export class Dish extends ModelBase {
  data!: DishFields

  constructor() {
    super(FIELDS_SCHEMA)
  }

  async create(data: DishFields) {
    this.data = data
    const query = `mutation {
      insert_dish(
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
