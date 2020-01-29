import { ModelBase } from './ModelBase'

export class Dish extends ModelBase<Dish> {
  restaurant_id!: string
  name!: string
  price!: number
  description!: string
  image!: string

  constructor(init?: Partial<Dish>) {
    super()
    Object.assign(this, init)
  }

  static fields() {
    return ['restaurant_id', 'name', 'price', 'description', 'image']
  }

  async upsert() {
    const query = `mutation {
      insert_dish(
        objects: ${this.asObject()},
        on_conflict: {
          constraint: dish_restaurant_id_name_key,
          update_columns: ${Dish.fieldsSerialized()}
        }
      ) {
        returning {
          id, created_at, updated_at, ${Dish.fieldsBare()}
        }
      }
    }`
    const response = await ModelBase.hasura(query)
    // TODO: Why is this path different to the upsert for restaurants?
    Object.assign(this, response.data.data.insert_dish.returning[0])
    return this.id
  }

  static async allDishesCount() {
    const query = `{
      dish_aggregate {
        aggregate {
          count
        }
      }
    }`
    const response = await ModelBase.hasura(query)
    return response.data.data.dish_aggregate.aggregate.count
  }

  static async deleteOne(name: string) {
    const query = `mutation {
      delete_dish(where: {name: {_eq: "${name}"}}) {
        returning { id }
      }
    }`
    return await ModelBase.hasura(query)
  }
}
