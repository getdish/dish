import { ModelBase } from './ModelBase'

export class Review extends ModelBase<Review> {
  restaurant_id!: string
  user_id!: string
  rating!: number
  text!: string

  constructor(init?: Partial<Review>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'Review'
  }

  static fields() {
    return ['restaurant_id', 'user_id', 'rating', 'text']
  }

  async findOne(restaurant_id: string, user_id: string) {
    const query = {
      query: {
        review: {
          __args: {
            where: {
              restaurant_id: { _eq: restaurant_id },
              user_id: { _eq: user_id },
            },
          },
          ...this.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    const objects = response.data.data.review
    if (objects.length === 0) {
      return ''
    }
    if (objects.length === 1) {
      Object.assign(this, objects[0])
      return this.id
    } else {
      throw new Error(objects.length + ` reviews found by Review.findOne()`)
    }
  }
}
