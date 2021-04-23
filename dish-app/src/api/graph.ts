import crypto from 'crypto'

import { route, useRouteBodyParser } from '@dish/api'
import { GRAPH_API_INTERNAL, fetchLog } from '@dish/graph'

import { redisClient, redisGet } from './_rc'

const hasuraHeaders = {
  'content-type': 'application/json',
  ...(process.env.HASURA_SECRET && {
    'x-hasura-admin-secret': process.env.HASURA_SECRET,
  }),
}

function shouldCache(body?: string) {
  return typeof body === 'string' && body.includes('restaurant_with_tags')
}

export default route(async (req, res) => {
  await useRouteBodyParser(req, res, { text: { type: '*/*', limit: '8192mb' } })
  const { body } = req
  if (!body) {
    res.send(200)
    return
  }
  const cacheKey = shouldCache(body) ? crypto.createHash('md5').update(body).digest('hex') : null
  if (cacheKey) {
    const cache = await redisGet(cacheKey)
    if (cache) {
      console.log('🏓 cache hit redis')
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
    if (cacheKey) {
      redisClient.set(cacheKey, JSON.stringify(response))
    }
    res.send(response)
  } catch (error) {
    console.error('graph err', error)
    res.status(500).send({ error })
  }
})
