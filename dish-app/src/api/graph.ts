import crypto from 'crypto'
import { promisify } from 'util'

import { route, useRouteBodyParser } from '@dish/api'
import { GRAPH_API_INTERNAL, fetchLog, getAuthHeaders } from '@dish/graph'
import { timer } from '@dish/helpers'
import redis from 'redis'

const pass = process.env.REDIS_PASSWORD
const envUrl = process.env.REDIS_URL
const url =
  envUrl || `redis://${pass ? `:${pass}:` : ''}${process.env.REDIS_HOST || 'localhost'}:6379`

const rc = redis.createClient({
  url,
})

rc.on('error', (err) => {
  console.log('redis ', JSON.stringify(err))
})

const rGet = promisify(rc.get).bind(rc)

const hasuraHeaders = {
  'content-type': 'application/json',
  ...getAuthHeaders(true),
}

function shouldCache(body: string) {
  return body.includes('restaurant_with_tags')
}

export default route(async (req, res) => {
  const time = timer()
  await useRouteBodyParser(req, res, { text: { type: '*/*', limit: '8192mb' } })
  time('body parse')
  const { body } = req
  const cacheKey = shouldCache(body) ? crypto.createHash('md5').update(body).digest('hex') : null
  time('cache key hash')

  if (cacheKey) {
    const cache = await rGet(cacheKey)
    if (cache) {
      res.send(JSON.parse(cache))
      return
    }
  }

  try {
    const headers = {
      ...req.headers,
      ...hasuraHeaders,
    } as any
    const hasuraRes = await fetchLog(GRAPH_API_INTERNAL, {
      method: 'POST',
      headers,
      body,
    })
    const response = await hasuraRes.json()
    time('hasura request')
    if (cacheKey) {
      rc.set(cacheKey, JSON.stringify(response))
    }
    res.send(response)
  } catch (error) {
    console.error('graph err', error)
    res.status(500).send({ error })
  }
})
