import { query } from '@dish/graph'

export const useUserQuery = (username: string) => {
  return query.user({
    where: {
      username: {
        _eq: username,
      },
    },
    limit: 1,
  })[0]
}
