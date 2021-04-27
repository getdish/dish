import crypto from 'crypto'

import { route, useRouteBodyParser } from '@dish/api'
import { isEqual } from '@dish/fast-compare'
import { GRAPH_API_INTERNAL, fetchLog } from '@dish/graph'
import { Request } from 'express'
import { FieldNode, SelectionNode, print } from 'graphql'
import { DefinitionNode, OperationDefinitionNode } from 'graphql'
import gql from 'graphql-tag'

import { redisClient, redisGet } from './_rc'

const hasuraHeaders = {
  'content-type': 'application/json',
  ...(process.env.HASURA_GRAPHQL_ADMIN_SECRET && {
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  }),
}

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

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
    console.log(` [graph] fetch: ${start}ms`)
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
    const variablesKey = crypto.createHash('md5').update(JSON.stringify(variables)).digest('hex')

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
        const alias = selection.alias?.value || name
        // avoid cache
        if (isLoggedIn) {
          if (name == 'review' || name == 'user') {
            console.log('skip', name)
            continue
          }
        }
        const selHash = crypto.createHash('md5').update(JSON.stringify(selection)).digest('hex')
        const key = `${selHash}-${variablesKey}`
        keys[alias] = key
        const cached = await redisGet(key)
        if (cached) {
          vals.set(selection, cached)
          data[alias] = JSON.parse(cached)
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
      return {
        type: 'partial',
        data,
        keys,
        body: JSON.stringify({
          query: print({
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
          }),
          variables,
        }),
      } as const
    })()

    // not at all cacheable
    if (!cache) {
      console.log('non-cacheable', req.body)
      res.send(await fetchFromGraph(req))
      return
    }

    // full cache hit
    if (cache.type === 'full') {
      console.log('🏓 cache full')
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
      const val = response.data[name]
      console.log('set into cache', name, cacheKey)
      redisClient.set(cacheKey, JSON.stringify(val), () => {
        //
      })
    }

    // merge in cached parts to response
    for (const key in cache.data) {
      response.data[key] = cache.data[key]
      console.log('merge cache in', key, cache.data[key])
    }

    res.send(response)
  } catch (error) {
    console.error('graph err', error)
    res.status(500).send({ error })
  }
})
