import { route, useRouteBodyParser } from '@dish/api'
import { GRAPH_API_INTERNAL, fetchLog } from '@dish/graph'
import { Request } from 'express'
import { FieldNode, OperationDefinitionNode, SelectionNode, print } from 'graphql'
import gql from 'graphql-tag'

import { redisGet, redisSet } from './_rc'

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

    const cache = await (async () => {
      if (avoidCache) {
        return null
      }
      const parsed = gql(query)
      const operation = parsed.definitions.find<OperationDefinitionNode>(
        ((x) => x.kind === 'OperationDefinition') as any
      )
      if (
        !operation ||
        operation.operation === 'mutation' ||
        operation.operation === 'subscription'
      ) {
        return null
      }
      const selections = operation.selectionSet.selections
      const vals = new WeakMap<SelectionNode, any>()
      const data = {}
      const keys = {}
      for (const selection of selections) {
        if (selection.kind !== 'Field') {
          console.warn('no field?', selection)
          continue
        }
        const name = `${selection.name.value || ''}`
        const alias = `${selection.alias?.value || ''}`

        // avoid cache
        if (isLoggedIn) {
          if (name == 'review' || name == 'user') {
            console.log('skip', name)
            continue
          }
        }
        const key = `${name}-${getKey(selection, variables)}`
        keys[alias] = key
        const cached = await redisGet(key)
        if (cached) {
          vals.set(selection, cached)
          data[alias] = JSON.parse(cached)
        } else {
          // console.log('cache miss', alias, name, key)
        }
      }
      const uncachedSelections = selections.filter((x) => !vals.has(x))
      const cachedSelections = selections.filter((x) => vals.has(x))
      // full cache
      if (uncachedSelections.length === 0) {
        return { type: 'full', data } as const
      }
      // no cache
      if (cachedSelections.length === 0) {
        return { type: 'empty', body, keys } as const
      }
      // partial cache, re-create query without cached items
      const parsedQuery = print({
        ...parsed,
        definitions: [
          {
            ...operation,
            selectionSet: {
              ...operation.selectionSet,
              selections: uncachedSelections,
            },
          },
        ],
      })
      const partialBody = JSON.stringify({
        query: parsedQuery,
        variables,
      })
      return {
        type: 'partial',
        data,
        keys,
        body: partialBody,
      } as const
    })()

    // not at all cacheable
    if (!cache) {
      res.send(await fetchFromGraph(req))
      return
    }

    // full cache hit
    if (cache.type === 'full') {
      console.log('🏓 100% cache')
      res.send({ data: cache.data })
      return
    }

    // fetch uncached parts
    const response = await fetchFromGraph(req, cache.body)

    // error
    if (!response?.data) {
      console.log('err no data in res')
      res.send(response)
      return
    }

    // update cache
    for (const name in response.data) {
      const cacheKey = cache.keys[name]
      if (cacheKey) {
        const val = response.data[name]
        // console.log('set into cache', name, cacheKey)
        redisSet(cacheKey, JSON.stringify(val))
      }
    }

    // merge in cached parts to response
    for (const key in cache.data) {
      response.data[key] = cache.data[key]
      // console.log('merge cache in', key)
    }

    res.send(response)
  } catch (error) {
    console.error('graph err', error)
    res.status(500).send({ error })
  }
})

const getKey = (obj: FieldNode | SelectionNode, variables?: any) => {
  let key = ''
  if ('selectionSet' in obj) {
    if (obj.selectionSet) {
      for (const item of obj.selectionSet.selections) {
        key += getKey(item, variables)
      }
    }
  }
  const sortedKeys = Object.keys(obj)
  sortedKeys.sort()
  for (const k of sortedKeys) {
    if (k == 'alias') continue
    if (k === 'selectionSet') continue
    if (k === 'kind') continue
    const val = obj[k]
    if (k === 'arguments') {
      for (const arg of val) {
        if (!arg || !arg.value) continue
        const name = arg.value.name.value
        if (!name) {
          // should never hit here...
          key += JSON.stringify(arg.value)
          continue
        }
        key += JSON.stringify(variables?.[name] ?? null)
      }
      continue
    }
    if (val == null || val == undefined) continue
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
  return key
}
