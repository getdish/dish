import util from 'util'

import { EnumType } from 'json-to-graphql-query'
import _ from 'lodash'

import { ModelBase } from './ModelBase'

export type RestaurantTagWithID = Partial<RestaurantTag> &
  Pick<RestaurantTag, 'tag_id'>

export class RestaurantTag extends ModelBase<RestaurantTag> {
  restaurant_id!: string
  tag_id!: string
  rating?: number
  rank?: number
  photos?: string[]

  constructor(init?: Partial<RestaurantTag>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'RestaurantTag'
  }

  static upsert_constraint() {
    return 'restaurant_tag_pkey'
  }

  static fields() {
    return ['rating', 'rank', 'photos']
  }

  static default_fields() {
    return ['restaurant_id', 'tag_id']
  }

  static essentialFields() {
    return {
      rating: true,
      rank: true,
      photos: true,
    }
  }

  static async upsertMany(
    restaurant_id: string,
    tags: Partial<RestaurantTag>[]
  ) {
    const objects = tags.map((i) => {
      if (typeof i.asObject != 'undefined') {
        i = i.asObject()
      }
      i.restaurant_id = restaurant_id
      return i
    })
    const query = {
      mutation: {
        insert_restaurant_tag: {
          __args: {
            objects: objects,
            on_conflict: {
              constraint: new EnumType(RestaurantTag.upsert_constraint()),
              update_columns: RestaurantTag.updatableColumns(),
            },
          },
          returning: RestaurantTag.fieldsAsObject(),
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.insert_restaurant_tag.returning.map(
      (data: RestaurantTag) => new RestaurantTag(data)
    )
  }
}
