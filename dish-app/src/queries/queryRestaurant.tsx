import { RestaurantQuery, order_by, query, restaurant } from '@dish/graph'

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
  }) as [restaurant | null]
}

export const queryRestaurantCoverPhoto = (restaurant: RestaurantQuery) => {
  // TODO using photo_table was causing incredibly slow queries
  return restaurant.image
}
