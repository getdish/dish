import { create, insertMultiple, search } from '@orama/orama'

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
  const db = await create({
    schema: {
      ...(Object.fromEntries(keys.map((key) => [key, 'string'])) as A),
      index: 'number',
    },
  })

  await insertMultiple(db, items)

  const results = await search(db, {
    term: query,
    // @ts-ignore
    properties: keys,
  })

  return results.hits.map((r) => r.document as A)
}

// @ts-expect-error
module.hot?.accept()
