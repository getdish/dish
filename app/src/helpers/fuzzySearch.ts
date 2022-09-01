import { create, insertBatch, search } from '@lyrasearch/lyra'

export async function fuzzySearch<A extends { [key: string]: any }>({
  items,
  limit = 20,
  query,
  keys = ['name'],
}: {
  items: A[]
  query: string
  keys?: (keyof A)[]
  limit?: number
}): Promise<A[]> {
  const db = create({
    schema: {
      ...(Object.fromEntries(keys.map((key) => [key, 'string'])) as A),
      index: 'number',
    },
  })

  await insertBatch(
    db,
    items.map((item, index) => ({
      index,
      ...(Object.fromEntries(keys.map((key) => [key, item[key]])) as A),
    }))
  )

  const results = search(db, {
    term: query,
    // @ts-ignore
    properties: keys,
  })

  return results.hits.map((result) => {
    return items[result.index as number]
  })
}

// @ts-expect-error
module.hot?.accept()
