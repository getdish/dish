import { route, useRouteBodyParser } from '@dish/api'
import { DISH_DEBUG, GRAPH_API_INTERNAL, fetchLog } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Request } from 'express'
import {
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionNode,
  SelectionSetNode,
  print,
} from 'graphql'
import gql from 'graphql-tag'

import { redisDeletePattern, redisGet, redisSet } from './_rc'

type GQLCacheProps = {
  query: string
  variables: Object
  isLoggedIn: boolean
  body: any
}

type CacheKeys = { [key: string]: string }

type GQLCacheResponse =
  | { type: 'full'; data: Object; parsed?: DocumentNode | null }
  | {
      type: 'partial'
      data: Object
      parsed?: DocumentNode | null
      aliasToCacheKey: CacheKeys
      selectionSet: SelectionSetNode
      body?: any
    }

const avoidCache = !process.env.NODE_ENV || process.env.NODE_ENV === 'test'
const hasuraHeaders = {
  'content-type': 'application/json',
  ...(process.env.HASURA_GRAPHQL_ADMIN_SECRET && {
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  }),
}

export default route(async (req, res) => {
  await useRouteBodyParser(req, res, { text: { type: '*/*', limit: '8192mb' } })
  const { body, method } = req
  let cache: GQLCacheResponse | null = null

  try {
    if (!body || method !== 'POST') {
      console.log(' [graph] method', method)
      res.send(200)
      return
    }
    const { query, variables } = typeof req.body !== 'string' ? req.body : JSON.parse(req.body)
    if (!query) {
      console.log(' [graph] no query')
      res.send(200)
      return
    }
    const isLoggedIn = req.headers['x-user-is-logged-in'] === 'true'

    cache = await parseQueryForCache({ query, variables, isLoggedIn, body })

    // not at all cacheable
    if (!cache) {
      res.send(await fetchFromGraph(req))
      return
    }

    // full cache hit
    if (cache.type === 'full') {
      res.send({ data: cache.data })
      return
    }

    // fetch uncached parts
    const finalBody = cache.type === 'partial' ? cache.body : body
    const response = await fetchFromGraph(req, finalBody)
    // error
    if (!response?.data) {
      console.log('Error! no data in res:', response, cache.type, finalBody)
      res.status(500).send(response)
      return
    }

    postProcessCache({ data: response.data, cache })

    res.send(response)
  } catch (error) {
    // prettier-ignore
    console.error('graph err', GRAPH_API_INTERNAL, error, body, cache?.parsed ? print(cache.parsed) : null)
    res.status(500).send({
      error: process.env.NODE_ENV === 'development' ? error : `error fetching: ${error.message}`,
    })
  }
})

const fetchFromGraph = async (req: Request, body?: any) => {
  const headers = {
    ...req.headers,
    ...hasuraHeaders,
  } as any
  const start = Date.now()
  try {
    const reqBody = body ?? req.body
    if (DISH_DEBUG > 1) {
      console.log(' fetchFromGraph body', JSON.stringify(reqBody))
    }
    const hasuraRes = await fetchLog(GRAPH_API_INTERNAL, {
      method: 'POST',
      headers,
      body: reqBody,
    })
    const val = await hasuraRes.json()
    console.log(` [graph] fetch(): ${Date.now() - start}ms`, val)
    if (DISH_DEBUG > 1) {
      console.log(JSON.stringify(val, null, 2))
    }
    return val
  } catch (err) {
    console.log(' [graph] fetch() error', err.message)
    throw err
  }
}

const baseTables = ['list', 'user', 'restaurant', 'review']

const parseQueryForCache = async (props: GQLCacheProps): Promise<GQLCacheResponse | null> => {
  if (avoidCache) {
    return null
  }
  const parsed = gql(props.query)

  const operation = parsed.definitions.find<OperationDefinitionNode>(
    ((x) => x.kind === 'OperationDefinition') as any
  )

  if (!operation || operation.operation === 'subscription') {
    return null
  }

  if (operation.operation === 'mutation') {
    // brute force
    // TODO can make this better, also can make this happen in a throttled way (also in a worker)
    let names = operation.selectionSet.selections
      .map((x) => (x.kind === 'Field' ? x.name.value : null))
      .filter(isPresent)
      .map((x) =>
        x
          .replace('insert_', '')
          .replace('update_', '')
          .replace('upsert_', '')
          .replace('delete_', '')
          .replace('_by_pk', '')
      )

    // ensure parent table clears too
    for (const baseName of baseTables) {
      if (names.some((x) => x !== baseName && x.startsWith(baseName))) {
        names.push(baseName)
      }
    }

    // ensure one of each
    names = [...new Set(names)]

    console.log(' [mutation] clearing cache for', names)
    for (const name of names) {
      const pattern = `*${name}*`
      redisDeletePattern(pattern)
    }
    return null
  }

  const cacheResult = await getCachedSelections(props, operation.selectionSet)

  if (cacheResult?.type === 'partial') {
    // rebuild new query
    const parsedQuery = print({
      ...parsed,
      definitions: [
        {
          ...operation,
          selectionSet: cacheResult.selectionSet!,
        },
      ],
    })
      // convert to single line
      .replace(/\n/g, ' ')
    if (process.env.DEBUG && process.env.NODE_ENV === 'development') {
      console.log(' 🐕 fetch ', parsedQuery)
    }

    const body = JSON.stringify({
      query: parsedQuery,
      variables: props.variables,
    })

    return {
      ...cacheResult,
      parsed,
      body,
    }
  }

  if (cacheResult) {
    return { ...cacheResult, parsed }
  }

  return null
}

// rough for now, we need some better basic clearing
const shouldSkipCache = (name: string, isLoggedIn = false) => {
  return name == 'user' || name.includes('_aggregate') || (isLoggedIn && name == 'review')
}

const getCacheable = (selection: FieldNode, isLoggedIn = false) => {
  // now we do sub-analysis one level deep
  const c: SelectionNode[] = []
  const u: SelectionNode[] = []
  for (const subSelection of selection.selectionSet?.selections ?? []) {
    if (subSelection.kind !== 'Field') {
      u.push(subSelection)
      continue
    }
    const subName = `${subSelection.name.value || ''}`
    const skip = shouldSkipCache(subName, isLoggedIn)
    if (skip) {
      u.push(subSelection)
    } else {
      c.push(subSelection)
    }
  }
  return [c, u] as const
}

async function getCachedSelections(
  props: GQLCacheProps,
  selectionSetIn: SelectionSetNode
): Promise<GQLCacheResponse | null> {
  const total = selectionSetIn.selections.length

  const data = {}
  const aliasToCacheKey: CacheKeys = {}
  const uncached: SelectionNode[] = []
  let numPartiallyCached = 0

  for (const selection of selectionSetIn.selections) {
    if (selection.kind !== 'Field') {
      uncached.push(selection)
      continue
    }
    const name = `${selection.name.value || ''}`
    const selectionSet = selection.selectionSet
    if (shouldSkipCache(name, props.isLoggedIn) || !selectionSet?.selections) {
      uncached.push(selection)
      continue
    }
    const [subCacheable, subUncacheable] = getCacheable(selection, props.isLoggedIn)
    if (!subCacheable.length) {
      if (subUncacheable.length) {
        uncached.push(selection)
      }
      continue
    }
    // if (process.env.NODE_ENV === 'development') console.log('subuncacheable', printSel(subUncacheable))
    // now build the key of just cacheable things and see if exists
    const cacheableSel: FieldNode = {
      ...selection,
      selectionSet: {
        ...selectionSet,
        selections: subCacheable,
      },
    }
    const cacheKey = getKey(cacheableSel, props.variables)
    const alias = `${selection.alias?.value || name}`

    const cached = await redisGet(cacheKey)
    if (process.env.DEBUG && process.env.NODE_ENV === 'development') {
      // prettier-ignore
      console.log(' >--', !!cached ? '✅' : '❌', name, ...(cached && subUncacheable.length ? ['uncached =', printSel(subUncacheable), '\n', cacheKey] : []))
    }
    if (cached) {
      data[alias] = JSON.parse(cached)
      // for partial cache hit
      if (subUncacheable.length) {
        const total = selectionSet.selections.length
        const partialNum = (total - subUncacheable.length) / total
        numPartiallyCached += partialNum
        uncached.push({
          ...selection,
          selectionSet: {
            ...selectionSet,
            selections: subUncacheable,
          },
        })
      }
    } else {
      uncached.push(selection)
      aliasToCacheKey[alias] = cacheKey
    }
  }

  const fetchFields = uncached.map((x) => x.kind === 'Field' && x.name.value).filter(Boolean)

  if (process.env.DEBUG) {
    // prettier-ignore
    console.log('uncached:', printSel(uncached))
  }

  const numCached = total - (uncached.length - numPartiallyCached)

  // prettier-ignore
  console.log(`🏓 ${Math.round(((numCached) / total) * 100)}% cache (${uncached.length} uncached ${total} total) ${fetchFields.length ? ` - fetching` : ''}`)

  // full cache
  if (uncached.length === 0) {
    return { type: 'full', data } as const
  }

  return {
    type: 'partial',
    data,
    aliasToCacheKey,
    selectionSet: {
      ...selectionSetIn,
      selections: uncached,
    },
  } as const
}

const printSel = (s: SelectionNode[]) => {
  return (
    s?.map((x) => [
      x['alias']?.['value'] ?? x['name']?.['value'],
      x['selectionSet']?.selections?.map((s) =>
        [s.name.value, printSel(s.selectionSet?.selections ?? [])].join(' ')
      ),
    ]) ?? ''
  )
}

const postProcessCache = ({ cache, data }: { data: any; cache: GQLCacheResponse }) => {
  // update cache
  if ('aliasToCacheKey' in cache) {
    updateCacheWithData({ cacheKeys: cache.aliasToCacheKey, data })
  }
  // merge in cached parts to response
  if ('data' in cache) {
    for (const ckey in cache.data) {
      const cval = cache.data[ckey]
      if (!cval) continue
      if (Array.isArray(cval)) {
        if (!data[ckey]) {
          data[ckey] = []
        }
        for (const [index, cvs] of cval.entries()) {
          if (!data[ckey][index]) {
            data[ckey][index] = {}
          }
          Object.assign(data[ckey][index], cvs)
        }
      } else {
        Object.assign(data[ckey], cval)
      }
    }
  }
}

const updateCacheWithData = ({ cacheKeys, data }: { data: any; cacheKeys: CacheKeys }) => {
  for (const key in data) {
    const cacheKey = cacheKeys[key]
    if (!cacheKey) {
      continue
    }
    const val = data[key]
    redisSet(cacheKey, JSON.stringify(val))
  }
}

const objStr = (obj) => {
  if (typeof obj === 'string') return obj
  if (Array.isArray(obj)) return obj.map(objStr)
  if (!obj || typeof obj !== 'object') return `${obj}`
  return Object.entries(obj).flat().map(objStr).join(':')
}

const getKey = (obj: FieldNode | SelectionNode, variables?: any, avoidRecursion = false) => {
  if (obj.kind !== 'Field') {
    return `${Math.random()}`
  }
  let key = ''
  const sortedKeys = Object.keys(obj)
  sortedKeys.sort()
  for (const k of sortedKeys) {
    if (k == 'alias') continue
    if (k === 'kind') continue
    const val = obj[k]
    if (k === 'selectionSet') {
      if (avoidRecursion) continue
      if (val) {
        key += `{`
        for (const item of val.selections) {
          key += getKey(item, variables) + ' '
        }
        key += `}`
      }
      continue
    }
    if (k === 'name') {
      key += val.value
      continue
    }
    if (k === 'arguments' && val.length) {
      key += `(${val
        .map((arg) => {
          if (!arg || !arg.value) return ''
          const name = arg.value.name.value ?? ''
          return `${arg.name.value}:${objStr(variables?.[name])}`
        })
        .join(',')})`
      continue
    }
    if (val == null || val == undefined) {
      key += 'null'
      continue
    }
    if (!val) {
      key += val
      continue
    }
    if (Array.isArray(val)) {
      key += val.map((x) => getKey(x, variables)).join(',')
      continue
    }
    if (val?.value) {
      key += val.value
      continue
    }
    key += typeof val === 'string' ? val : Object.entries(val).flat().join('.')
  }
  if (obj.name.value !== key) {
    return `${obj.name.value}-${key}`
  }
  return key
}
