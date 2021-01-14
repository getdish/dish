import { query } from '@dish/graph'

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
  })[0]
}
