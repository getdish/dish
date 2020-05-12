import { EnumType } from 'json-to-graphql-query'

import { ModelBase } from './ModelBase'
import { Restaurant } from './Restaurant'
import { Tag } from './Tag'
import { User } from './User'

export class Review extends ModelBase<Review> {
  restaurant_id!: string
  restaurant!: Restaurant
  user_id!: string
  user!: User
  tag_id!: string
  tag!: Tag
  rating!: number
  text!: string

  static model_name() {
    return 'Review'
  }

  static fields() {
    return ['restaurant_id', 'user_id', 'tag_id', 'rating', 'text']
  }

  async findOne(restaurant_id: string, user_id: string, tag_id = '') {
    let tax_where = {
      tag_id: {},
    }
    let tax_return = {}
    if (tag_id != '') {
      tax_return = {
        tag: Tag.fieldsAsObject(),
      }
      tax_where = {
        tag_id: { _eq: tag_id },
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
    const objects = response.data.review
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
    const objects = response.data.review
    if (objects.length === 0) {
      return []
    }
    return response.data.review.map((data: Partial<Review>) => new Review(data))
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
    const objects = response.data.review
    if (objects.length === 0) {
      return []
    }
    return response.data.review.map((data: Partial<Review>) => new Review(data))
  }
}
