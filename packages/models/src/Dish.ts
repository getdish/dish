import { ModelBase, MapSchema } from './ModelBase'

export const FIELDS_SCHEMA = ModelBase.asSchema({
  restaurant_id: 'string',
  price: 'number',
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

  async upsert(data: DishFields) {
    this.data = data
    const query = `mutation {
      insert_dish(
        objects: ${this.stringify(this.data)},
        on_conflict: {
          constraint: dish_restaurant_id_name_key,
          update_columns: ${this.fields()}
        }
      ) {
        returning {
          restaurant_id, name
        }
      }
    }`
    return await this.hasura(query)
  }

  async delete_all() {
    const query = `mutation {
      delete_dish(where: {id: {_neq: ""}}) {
        returning { id }
      }
    }`
    return await this.hasura(query)
  }
}
