import { query } from '@dish/graph'

// TODO we need to either make this take slug + region + userSlug
// or redo list creation / ensure slugs are unique

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
