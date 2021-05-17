import { route, useRouteBodyParser } from '@dish/api'
import { GRAPH_API_INTERNAL, fetchLog } from '@dish/graph'
import { Request } from 'express'
import { FieldNode, OperationDefinitionNode, SelectionNode, SelectionSetNode, print } from 'graphql'
import gql from 'graphql-tag'

import { redisClient, redisGet, redisSet } from './_rc'

const hasuraHeaders = {
  'content-type': 'application/json',
  ...(process.env.HASURA_GRAPHQL_ADMIN_SECRET && {
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  }),
}

const avoidCache = !process.env.NODE_ENV || process.env.NODE_ENV === 'test'

const fetchFromGraph = async (req: Request, body?: any) => {
  const headers = {
    ...req.headers,
    ...hasuraHeaders,
  } as any
  const start = Date.now()
  try {
    const hasuraRes = await fetchLog(GRAPH_API_INTERNAL, {
      method: 'POST',
      headers,
      body: body ?? req.body,
    })
    return await hasuraRes.json()
  } finally {
    console.log(` [graph] fetch: ${Date.now() - start}ms`)
  }
}

type GQLCacheProps = {
  query: string
  variables: Object
  isLoggedIn: boolean
  body: any
}

type CacheKeys = { [key: string]: string }

type GQLCacheResponse =
  | { type: 'full'; data: Object }
  | { type: 'empty'; aliasToCacheKey: CacheKeys }
  | { type: 'partial'; data: Object; aliasToCacheKey: CacheKeys; selectionSet: SelectionSetNode }

const parseQueryForCache = async (props: GQLCacheProps) => {
  if (avoidCache) {
    return null
  }
  const parsed = gql(props.query)
  // console.log('query', print(parsed))

  const operation = parsed.definitions.find<OperationDefinitionNode>(
    ((x) => x.kind === 'OperationDefinition') as any
  )

  if (!operation || operation.operation === 'subscription') {
    return null
  }

  if (operation.operation === 'mutation') {
    // for now we just flush on every mutation :(
    // TODO if we can just clear by type that would improve a ton
    redisClient.flushall()
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
          selectionSet: cacheResult.selectionSet,
        },
      ],
    })
    // console.log('partial rebuilt query', parsedQuery)
    const body = JSON.stringify({
      query: parsedQuery,
      variables: props.variables,
    })
    return {
      ...cacheResult,
      body,
    }
  }

  return cacheResult
}

// rough for now, we need some better basic clearing
const shouldSkipCache = (props: GQLCacheProps, name: string) =>
  name == 'user' ||
  name.includes('_aggregate') ||
  (props.isLoggedIn && (name == 'review' || name == 'reviews' || name === 'list'))

async function getCachedSelections(
  props: GQLCacheProps,
  selectionSetIn: SelectionSetNode
): Promise<GQLCacheResponse | null> {
  const total = selectionSetIn.selections.length

  const data = {}
  const aliasToCacheKey: CacheKeys = {}
  let uncached: SelectionNode[] = []

  for (const selection of selectionSetIn.selections) {
    if (selection.kind !== 'Field') {
      uncached.push(selection)
      continue
    }
    const name = `${selection.name.value || ''}`
    if (shouldSkipCache(props, name) || !selection.selectionSet?.selections) {
      uncached.push(selection)
      continue
    }
    // now we do sub-analysis one level deep
    const subCached: SelectionNode[] = []
    const subUncached: SelectionNode[] = []
    for (const subSelection of selection.selectionSet.selections) {
      if (subSelection.kind !== 'Field') {
        subUncached.push(subSelection)
        continue
      }
      const subName = `${subSelection.name.value || ''}`
      if (shouldSkipCache(props, subName)) {
        subUncached.push(selection)
        continue
      }
      subCached.push(subSelection)
    }
    // now build the key of just cacheable things and see if exists
    const cachableSelection: FieldNode = {
      ...selection,
      selectionSet: {
        ...selection.selectionSet,
        selections: subCached,
      },
    }
    const cacheKey = getKey(cachableSelection, props.variables)
    const alias = `${selection.alias?.value || name}`
    aliasToCacheKey[alias] = cacheKey
    const cached = await redisGet(cacheKey)
    if (!cached) {
      uncached.push(selection)
      continue
    }
    data[alias] = JSON.parse(cached)
    // we may have partial cache hit, if so fetch the uncached parts only
    if (subUncached.length) {
      uncached = [...uncached, ...subUncached]
    }
  }

  // full cache
  if (uncached.length === 0) {
    console.log('🏓 100% cache')
    return { type: 'full', data } as const
  }

  // can cache but none found (use og query)
  if (uncached.length === total) {
    console.log(`🏓 0% cache`)
    return { type: 'empty', aliasToCacheKey } as const
  }

  console.log(total, uncached.length)
  console.log(`🏓 ${Math.round(((total - uncached.length) / total) * 100)}% cache`)
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

const postProcessCache = ({ cache, data }: { data: any; cache: GQLCacheResponse }) => {
  // update cache
  if ('aliasToCacheKey' in cache) {
    updateCacheWithData({ cacheKeys: cache.aliasToCacheKey, data })
  }

  // merge in cached parts to response
  if ('data' in cache) {
    for (const key in cache.data) {
      data[key] = data[key] || {}
      const cval = cache.data[key]
      for (const ckey in cval) {
        data[key] = data[key] ?? cval
      }
    }
  }
}

export default route(async (req, res) => {
  try {
    await useRouteBodyParser(req, res, { text: { type: '*/*', limit: '8192mb' } })
    const { body, method } = req
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

    const cache = await parseQueryForCache({ query, variables, isLoggedIn, body })

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
    const response = await fetchFromGraph(req, cache.type === 'partial' ? cache.body : body)

    // error
    if (!response?.data) {
      console.log('err no data in res')
      res.send(response)
      return
    }

    postProcessCache({ data: response.data, cache })

    res.send(response)
  } catch (error) {
    console.error('graph err', error)
    res.status(500).send({ error })
  }
})

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
        for (const item of val.selections) {
          key += getKey(item, variables)
        }
      }
      continue
    }
    if (k === 'name') {
      key += val.value
      continue
    }
    if (k === 'arguments') {
      key += `(${val
        .map((arg) => {
          if (!arg || !arg.value) return ''
          const name = arg.value.name.value ?? ''
          return `${arg.name.value}:${JSON.stringify(variables?.[name] ?? null)}`
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
    key += typeof val === 'string' ? val : JSON.stringify(val)
  }
  // console.log('key', obj.name.value, key)
  return `${obj.name.value}-${key}`
}
