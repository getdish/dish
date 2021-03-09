import { promisify } from 'util'

import { route, useRouteBodyParser } from '@dish/api'
import { GRAPH_API_INTERNAL, fetchLog, getAuthHeaders } from '@dish/graph'
import redis from 'redis'

const pass = process.env.REDIS_PASSWORD
const envUrl = process.env.FLY_REDIS_CACHE_URL || process.env.REDIS_URL
const url =
  envUrl ||
  `redis://${pass ? `:${pass}` : ''}:${
    process.env.REDIS_HOST || 'localhost'
  }:6379`

console.log('redis url', url)
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
  return body.includes('restaurant_new(')
}

export default route(async (req, res) => {
  await useRouteBodyParser(req, res, { text: { type: '*/*' } })
  const { body } = req
  const doCache = shouldCache(body)

  if (doCache) {
    const cache = await rGet(body)
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
    if (doCache) {
      rc.set(body, JSON.stringify(response))
    }
    res.send(response)
  } catch (error) {
    console.error('graph err', error)
    res.status(500).send({ error })
  }
})
