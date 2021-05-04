import { route } from '@dish/api'
import { SEARCH_DOMAIN_INTERNAL } from '@dish/graph'
import proxy from 'express-http-proxy'

import { redisGet } from './_rc'

const proxyHandler = proxy(SEARCH_DOMAIN_INTERNAL)

export default route(async (req, res, nexy) => {
  if (process.env.NODE_ENV === 'test') {
    proxyHandler(req, res, nexy)
    return
  }
  const key = JSON.stringify(req.params ?? [])
  console.log('[search] key', key)
  const cached = await redisGet(key)
  if (cached) {
    console.log('🏓 [search] cache hit')
    res.send(JSON.parse(cached))
    return
  }
  proxyHandler(req, res, nexy)
})
