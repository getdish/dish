import { query } from '@dish/graph'

export const restaurantQuery = (slug: string) => {
  return query.restaurant({
    where: {
      slug: {
        _eq: slug,
      },
    },
  })[0]
}
