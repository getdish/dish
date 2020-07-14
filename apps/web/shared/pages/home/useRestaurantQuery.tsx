import { query } from '@dish/graph'

export const useRestaurantQuery = (slug: string) => {
  return query.restaurant({
    where: {
      slug: {
        _eq: slug,
      },
    },
    limit: 1,
  })[0]
}
