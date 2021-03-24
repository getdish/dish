import { selectFields } from '@dish/gqless'
import {
  Review,
  ReviewTagSentence,
  ReviewWithId,
  Scalars,
  globalTagId,
  order_by,
  query,
  resolvedWithFields,
  review,
  reviewUpsert,
  review_constraint,
} from '@dish/graph'
import { decode } from 'html-entities'
import { chunk, uniqBy } from 'lodash'

type uuid = Scalars['uuid']

export async function reviewFindAllForRestaurant(restaurant_id: uuid) {
  return await resolvedWithFields(
    () => {
      const r = query.review({
        where: {
          restaurant_id: { _eq: restaurant_id },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })

      return r
    },
    {
      select: (r: review[]) => {
        return r.map((review) => {
          return {
            ...selectFields(review, '*', 2),
            restaurant: {
              ...selectFields(review.restaurant),
              tags: selectFields(review.restaurant.tags(), '*', 2),
            },
            sentiments: selectFields(review.sentiments(), '*', 2),
          }
        })
      },
    }
  )
}

export async function reviewFindAllForUser(user_id: uuid) {
  return await resolvedWithFields(
    () => {
      return query.review({
        where: {
          user_id: { _eq: user_id },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })
    },
    {
      select: (r: review[]) => {
        return r.map((review) => {
          return {
            ...selectFields(review, '*', 2),
            restaurant: {
              ...selectFields(review.restaurant),
              tags: selectFields(review.restaurant.tags(), '*', 2),
            },
            sentiments: selectFields(review.sentiments(), '*', 2),
          }
        })
      },
    }
  )
}

export async function userFavoriteARestaurant(
  user_id: uuid,
  restaurant_id: uuid,
  favorited = true
) {
  const [review] = await reviewUpsert(
    [
      {
        restaurant_id: restaurant_id,
        user_id: user_id,
        tag_id: globalTagId,
        favorited: favorited,
      },
    ],
    undefined,
    {
      select: (r_v: review[]) => {
        return r_v.map((review) => {
          return {
            ...selectFields(review, '*', 2),
            restaurant: {
              ...selectFields(review.restaurant),
              tags: selectFields(review.restaurant.tags(), '*', 2),
            },
            sentiments: selectFields(review.sentiments(), '*', 2),
          }
        })
      },
    }
  )
  return review
}

export async function userFavorites(user_id: string) {
  return await resolvedWithFields(
    () => {
      return query.review({
        where: {
          user_id: { _eq: user_id },
          favorited: { _eq: true },
        },
        order_by: [
          {
            updated_at: order_by.asc,
          },
        ],
      })
    },
    {
      select: (r: review[]) => {
        return r.map((review) => {
          return {
            ...selectFields(review, '*', 2),
            restaurant: {
              ...selectFields(review.restaurant),
              tags: selectFields(review.restaurant.tags(), '*', 2),
            },
            sentiments: selectFields(review.sentiments(), '*', 2),
          }
        })
      },
    }
  )
}

export async function reviewExternalUpsert(reviews: Review[]) {
  reviews = reviews.map((r) => {
    r.text = cleanReviewText(r.text)
    return r
  })
  let all: ReviewWithId[] = []
  const grouped = chunk(reviews, 40)
  for (const [index, group] of grouped.entries()) {
    // prettier-ignore
    console.log('reviewExternalUpsert: Inserting chunk', index, 'of', grouped.length)
    all = [
      ...all,
      ...(await reviewUpsert(
        group,
        review_constraint.review_username_restaurant_id_tag_id_authored_at_key,
        {
          keys: ['__typename'],
        }
      )),
    ]
  }

  return all
}

export function cleanReviewText(text: string | null | undefined) {
  if (!text) return ''
  const br = /<br\s*[\/]?>/gi
  const cleaned = text.replace(br, '\n')
  return decode(cleaned)
}

export function dedupeReviews(reviews: Review[]) {
  return uniqBy(reviews, (review: Review) => {
    return (
      review.username +
      review.restaurant_id +
      review.tag_id +
      review.authored_at
    )
  })
}

export function dedupeSentiments<A extends ReviewTagSentence>(sentiments: A[]) {
  return uniqBy(sentiments, (x) => {
    return x.tag_id + x.sentence
  })
}
