import { RestaurantQuery, order_by, query } from '@dish/graph'

export const queryRestaurant = (slug: string) => {
  if (typeof slug !== 'string') {
    throw new Error(`No slug`)
  }
  return query.restaurant({
    where: {
      slug: {
        _eq: slug,
      },
    },
    limit: 1,
  })
}

export const queryRestaurantCoverPhoto = (restaurant: RestaurantQuery) => {
  return restaurant.photo_table({
    order_by: [{ photo: { quality: order_by.desc } }],
    limit: 1,
  })?.[0]?.photo.url
}
