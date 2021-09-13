import { listFindOne } from '@dish/graph'

export const getListId = async (slug: string) =>
  (
    await listFindOne(
      {
        slug,
      },
      {
        keys: ['id'],
      }
    )
  )?.id
