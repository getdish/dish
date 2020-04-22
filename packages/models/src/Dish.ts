import { ModelBase } from './ModelBase'

export type TopCuisineDish = Partial<Dish> & {
  rating: number
  count: number
  image: string
}

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

  static model_name() {
    return 'Dish'
  }

  static fields() {
    return ['restaurant_id', 'name', 'price', 'description', 'image']
  }

  static upsert_constraint() {
    return 'dish_restaurant_id_name_key'
  }
}
