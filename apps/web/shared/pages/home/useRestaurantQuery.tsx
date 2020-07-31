import { query } from '@dish/graph'

export const restaurantQuery = (slug: string) => {
  return query.restaurant({
    where: {
      slug: {
        _eq: slug,
      },
    },
    limit: 1,
  })
}

export const useRestaurantQuery = (slug: string) => {
  return restaurantQuery(slug)[0]
}
