import { promisify } from 'util'

import { route, useRouteBodyParser } from '@dish/api'
import { getAuthHeaders, getGraphEndpointInternal } from '@dish/graph'
import redis from 'redis'

const host =
  process.env.FLY_REDIS_CACHE_URL || process.env.REDIS_HOST || 'localhost'
console.log('redis host', host)
const rc = redis.createClient({
  host,
})
const rGet = promisify(rc.get).bind(rc)

const hasuraHeaders = {
  'content-type': 'application/json',
  ...getAuthHeaders(true),
}

console.log('hasuraHeaders', hasuraHeaders)

const hasuraEndpoint = getGraphEndpointInternal()

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
    console.log('sending', headers, hasuraHeaders)
    const hasuraRes = await fetch(hasuraEndpoint, {
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
