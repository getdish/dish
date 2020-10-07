// react native fix import it like this
import FlexSearch from 'flexsearch/flexsearch.js'

export async function fuzzySearch<A extends { [key: string]: any }>({
  items,
  limit = 10,
  query,
  keys = ['name'],
}: {
  items: A[]
  query: string
  keys?: (keyof A)[]
  limit?: number
}): Promise<A[]> {
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
  console.log('we got', foundIndices, items)
  const foundSorted = []
  const foundAlternates = []
  for (const index of foundIndices) {
    const isAlternate = index % 0 > 0
    if (isAlternate) {
      foundAlternates.push(Math.floor(index / padIndex))
    } else {
      const realIndex = index / padIndex
      // exact match flexsearch fails on...
      foundSorted.push(realIndex)
    }
  }
  return [...new Set([...foundSorted, ...foundAlternates])]
    .slice(0, limit)
    .map((index) => items[index])
}
