import { CACHE_KEY_PREFIX, route } from '@dish/api'

import { redisClient, redisDeletePattern } from './_redis'

export default route(async (req, res) => {
  console.warn('Clearing REDIS cache')
  if (req.params?.force) {
    await redisClient.flushall()
  } else {
    await redisDeletePattern(`${CACHE_KEY_PREFIX}*`)
  }
  res.send('ok')
})
