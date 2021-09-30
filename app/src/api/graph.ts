import { route, useRouteBodyParser } from '@dish/api'
import { DISH_DEBUG, GRAPH_API_INTERNAL, fetchLog } from '@dish/graph'
import { useLogger } from '@envelop/core'
import { useParserCache } from '@envelop/parser-cache'
import { createInMemoryCache, useResponseCache } from '@envelop/response-cache'
import { useValidationCache } from '@envelop/validation-cache'
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap'
import { Request } from 'express'
import { print } from 'graphql'

import { CreateApp, EZApp } from './_graphez'

const avoidCache = !process.env.NODE_ENV || process.env.NODE_ENV === 'test'
const hasuraHeaders = {
  'content-type': 'application/json',
  ...(process.env.HASURA_GRAPHQL_ADMIN_SECRET && {
    'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
  }),
}

export default route(async (req, res) => {
  await useRouteBodyParser(req, res, { text: { type: '*/*', limit: '8mb' } })
  req.body = typeof req.body !== 'string' ? req.body : JSON.parse(req.body)
  if (!ezApp) {
    await start()
    if (!ezApp) {
      console.warn('⚠️ no ezapp')
      res.json(null)
      return
    }
  }
  await ezApp!.apiHandler(req, res)
})

let ezApp: EZApp | null = null

async function start() {
  // todo use redis once https://github.com/dotansimha/envelop/pull/685 merged
  const cache = createInMemoryCache()
  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  })
  const oneHour = 60_000 * 60
  const oneDay = oneHour * 24
  ezApp = CreateApp({
    schema,
    envelop: {
      plugins: [
        useValidationCache(),
        useResponseCache({
          ttl: oneDay * 7,
          ttlPerType: {
            // user: 0,
            reviews_aggregate: 0,
            list_reviews_aggregate: 0,
          },
          cache,
          enabled: (context: Request) => {
            return !avoidCache
          },
          invalidateViaMutation: true,
        }),
        useParserCache(),
        // useTiming(),
        useLogger({
          logFn: (eventName, args) => {
            console.log('gql', eventName, args)
          },
        }),
      ],
    },
  }).buildApp({})
}

const fetchFromGraph = async ({ headers, body }: { headers?: any; body: any }) => {
  const start = Date.now()
  try {
    if (DISH_DEBUG > 1) {
      console.log(' fetchFromGraph body', JSON.stringify(body))
    }
    const hasuraRes = await fetchLog(GRAPH_API_INTERNAL, {
      method: 'POST',
      headers: {
        ...headers,
        ...hasuraHeaders,
      },
      body,
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

const executor = async ({ document, variables }: any) => {
  const query = print(document)
  return fetchFromGraph({
    body: JSON.stringify({ query, variables }),
  })
}

start()
