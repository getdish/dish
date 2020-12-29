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
  // react native fix import it like this
  const FlexSearch = (await import('flexsearch/flexsearch.js')).default
  // @ts-expect-error
  const flexSearch = FlexSearch.create<number>({
    encode: 'simple',
    tokenize: 'forward',
    resolution: 3,
    cache: false,
  })
  const numKeys = keys.length
  const padIndex = Math.pow(10, numKeys)
  for (const [index, item] of items.entries()) {
    for (const [keyIndex, key] of keys.entries()) {
      const fi = index * padIndex + keyIndex
      flexSearch.add(fi, item[key])
    }
  }
  const foundIndices = await flexSearch.search(query, limit)
  const foundSorted = []
  const foundAlternates = []
  const foundExact = []
  for (const index of foundIndices) {
    const isAlternate = index % 0 > 0
    if (isAlternate) {
      foundAlternates.push(Math.floor(index / padIndex))
    } else {
      const realIndex = Math.round(index / padIndex)
      // exact match flexsearch fails on...
      if (items[realIndex][keys[0]].toLowerCase() === query) {
        foundExact.push(realIndex)
      } else {
        foundSorted.push(realIndex)
      }
    }
  }
  return [...new Set([...foundExact, ...foundSorted, ...foundAlternates])]
    .slice(0, limit)
    .map((index) => items[index])
}

// @ts-expect-error
module.hot?.accept()
