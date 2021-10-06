import { route } from '@dish/api'
import { SEARCH_DOMAIN_INTERNAL } from '@dish/graph'
import proxy from 'express-http-proxy'

import { redisGet, redisSet } from './_redis'

console.log('SEARCH_DOMAIN_INTERNAL', SEARCH_DOMAIN_INTERNAL)

const proxyHandler = proxy(SEARCH_DOMAIN_INTERNAL, {
  userResDecorator: function (proxyRes, proxyResData, req, userRes) {
    const val = proxyResData.toString('utf8')
    if (process.env.NODE_ENV === 'test') {
      return val
    }
    console.log('val', val)
    redisSet(req['_key'], val)
    return val
  },
})

export default route(async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    proxyHandler(req, res, next)
    return
  }
  const key = simpleHash(JSON.stringify(req.query ?? []))
  req['_key'] = key
  const cached = await redisGet(key)
  if (cached) {
    console.log('🏓 [search] cache hit')
    res.send(JSON.parse(cached))
    return
  }
  proxyHandler(req, res, next)
})

export const simpleHash = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36)
}
