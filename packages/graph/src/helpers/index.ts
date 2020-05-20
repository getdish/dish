import { Auth } from '../auth'
import { mutation, query, resolved } from './index'

export * from './helpers/tag'
export * from './helpers/tag_tag'

type DishGeneric = {
  id: string
}

export const isNode = typeof window == 'undefined'
export const isBrowserProd =
  !isNode && window.location.hostname.includes('dish')

const isWorker =
  typeof document !== 'undefined' && !document.getElementById('root')

export function getGraphEndpointDomain() {
  const LOCAL_HASURA = 'http://localhost:8080'
  const LIVE_HASURA = 'https://hasura.rio.dishapp.com'

  if (isWorker) {
    return LIVE_HASURA
  }

  let domain: string
  if (isNode) {
    domain =
      process.env.HASURA_ENDPOINT ||
      process.env.REACT_APP_HASURA_ENDPOINT ||
      LOCAL_HASURA
  } else {
    if (isBrowserProd) {
      domain = LIVE_HASURA
    } else {
      if (window.location.hostname.includes('hasura_live')) {
        domain = LIVE_HASURA
      } else {
        domain = process.env.REACT_APP_HASURA_ENDPOINT || LOCAL_HASURA
      }
    }
  }

  return domain
}

export function getGraphEndpoint() {
  return `${getGraphEndpointDomain()}/v1/graphql`
}

export async function graphqlGet(query: string = '', variables: Object = {}) {
  const res = await fetch(getGraphEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...Auth.getHeaders(),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    mode: 'cors',
  })
  return await res.json()
}

const slugCache = {}
const sets = [
  { to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
  { to: 'c', from: '[ÇĆĈČ]' },
  { to: 'd', from: '[ÐĎĐÞ]' },
  { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
  { to: 'g', from: '[ĜĞĢǴ]' },
  { to: 'h', from: '[ĤḦ]' },
  { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
  { to: 'j', from: '[Ĵ]' },
  { to: 'ij', from: '[Ĳ]' },
  { to: 'k', from: '[Ķ]' },
  { to: 'l', from: '[ĹĻĽŁ]' },
  { to: 'm', from: '[Ḿ]' },
  { to: 'n', from: '[ÑŃŅŇ]' },
  { to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
  { to: 'oe', from: '[Œ]' },
  { to: 'p', from: '[ṕ]' },
  { to: 'r', from: '[ŔŖŘ]' },
  { to: 's', from: '[ßŚŜŞŠ]' },
  { to: 't', from: '[ŢŤ]' },
  { to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
  { to: 'w', from: '[ẂŴẀẄ]' },
  { to: 'x', from: '[ẍ]' },
  { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
  { to: 'z', from: '[ŹŻŽ]' },
  { to: '-', from: "[·/_,:;']" },
].map((x) => ({
  ...x,
  from: new RegExp(x.from, 'gi'),
}))

export const slugify = (text: string, separator = '-') => {
  if (!slugCache[separator]) {
    slugCache[separator] = {}
  }
  if (slugCache[separator][text]) {
    return slugCache[separator][text]
  }

  let out = text.toString().toLowerCase().trim()

  for (const set of sets) {
    out = out.replace(set.from, set.to)
  }

  out = out
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

  if (typeof separator !== 'undefined' && separator !== '-') {
    out = out.replace(/-/g, separator)
  }

  if (out == '') {
    return `no-slug`
  }

  slugCache[separator][out] = out
  return out
}

export async function findOne<T>(table: string, hash: Partial<T>) {
  const where = Object.keys(hash).map((key) => {
    return { [key]: { _eq: hash[key] } }
  })
  return await resolved(() => {
    return query[table]({
      where: {
        _and: where,
      },
    }) as T
  })
}

export async function insert<T>(table: string, objects: T[]) {
  return await resolved(() => {
    return mutation['insert_' + table]({
      objects: objects,
    }) as T[]
  })
}

export async function upsert<T>(
  table: string,
  constraint: string,
  objects: T[]
) {
  // TODO: Is there a better way to get the updateable columns?
  const update_columns = Object.keys(objects[0])
  return await resolved(() => {
    return mutation['insert_' + table]({
      objects: objects,
      on_conflict: {
        constraint: constraint,
        update_columns: update_columns,
      },
    }) as T[]
  })
}

export async function update<T extends DishGeneric>(table: string, object: T) {
  return await resolved(() => {
    return mutation['update_' + table]({
      where: { id: { _eq: object.id } },
      _set: object,
    }) as T
  })
}

// Taken from: https://github.com/trekhleb/javascript-algorithms
export function levenshteinDistance(a: string, b: string) {
  // Create empty edit distance matrix for all possible modifications of
  // substrings of a to substrings of b.
  const distanceMatrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null))

  // Fill the first row of the matrix.
  // If this is first row then we're transforming empty string to a.
  // In this case the number of transformations equals to size of a substring.
  for (let i = 0; i <= a.length; i += 1) {
    distanceMatrix[0][i] = i
  }

  // Fill the first column of the matrix.
  // If this is first column then we're transforming empty string to b.
  // In this case the number of transformations equals to size of b substring.
  for (let j = 0; j <= b.length; j += 1) {
    distanceMatrix[j][0] = j
  }

  for (let j = 1; j <= b.length; j += 1) {
    for (let i = 1; i <= a.length; i += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1
      distanceMatrix[j][i] = Math.min(
        distanceMatrix[j][i - 1] + 1, // deletion
        distanceMatrix[j - 1][i] + 1, // insertion
        distanceMatrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }

  return distanceMatrix[b.length][a.length]
}
