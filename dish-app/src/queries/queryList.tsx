import { query } from '@dish/graph'

export function queryList(slug: string) {
  return query.list({
    limit: 1,
    where: {
      slug: {
        _eq: slug,
      },
    },
  })
}
