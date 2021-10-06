import { CACHE_KEY_PREFIX, route } from '@dish/api'

import { redisClient, redisDeletePattern } from './_redis'

export default route((_req, res) => {
  console.warn('Clearing REDIS cache')
  redisDeletePattern(`${CACHE_KEY_PREFIX}*`)
  res.send('ok')
})
