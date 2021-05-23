import { query } from '@dish/graph'

export const queryTag = (id: string) => {
  return query.tag({
    where: {
      id: { _eq: id },
    },
    limit: 1,
  })
}
