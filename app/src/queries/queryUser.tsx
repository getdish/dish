import { query } from '@dish/graph'

export const queryUserQuery = (username: string) => {
  return query.user({
    where: {
      username: {
        _eq: username,
      },
    },
    limit: 1,
  })
}

export const queryUser = (username: string) => {
  return queryUserQuery(username)[0]
}
