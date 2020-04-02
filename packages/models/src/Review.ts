import { EnumType } from 'json-to-graphql-query'

import { ModelBase } from './ModelBase'
import { Restaurant } from './Restaurant'
import { Taxonomy } from './Taxonomy'
import { User } from './User'

export class Review extends ModelBase<Review> {
  restaurant_id!: string
  restaurant!: Restaurant
  user_id!: string
  user!: User
  taxonomy_id!: string
  taxonomy!: Taxonomy
  rating!: number
  text!: string

  static model_name() {
    return 'Review'
  }

  static fields() {
    return ['restaurant_id', 'user_id', 'taxonomy_id', 'rating', 'text']
  }

  async findOne(restaurant_id: string, user_id: string, taxonomy_id = '') {
    let tax_where = {
      taxonomy_id: {},
    }
    let tax_return = {}
    if (taxonomy_id != '') {
      tax_return = {
        taxonomy: Taxonomy.fieldsAsObject(),
      }
      tax_where = {
        taxonomy_id: { _eq: taxonomy_id },
      }
    }
    const query = {
      query: {
        review: {
          __args: {
            where: {
              restaurant_id: { _eq: restaurant_id },
              user_id: { _eq: user_id },
              ...tax_where,
            },
          },
          ...this.fieldsAsObject(),
          ...tax_return,
          restaurant: Restaurant.fieldsAsObject(),
          user: User.fieldsAsObject(),
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

  static async findAllForRestaurant(restaurant_id: string) {
    const query = {
      query: {
        review: {
          __args: {
            where: {
              restaurant_id: { _eq: restaurant_id },
            },
            order_by: {
              updated_at: new EnumType('desc'),
            },
          },
          ...this.fieldsAsObject(),
          user: User.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    const objects = response.data.data.review
    if (objects.length === 0) {
      return []
    }
    return response.data.data.review.map(
      (data: Partial<Review>) => new Review(data)
    )
  }

  static async findAllForUser(user_id: string) {
    const query = {
      query: {
        review: {
          __args: {
            where: {
              user_id: { _eq: user_id },
            },
            order_by: {
              updated_at: new EnumType('desc'),
            },
          },
          ...this.fieldsAsObject(),
          restaurant: Restaurant.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    const objects = response.data.data.review
    if (objects.length === 0) {
      return []
    }
    return response.data.data.review.map(
      (data: Partial<Review>) => new Review(data)
    )
  }
}
