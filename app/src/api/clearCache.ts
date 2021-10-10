import { CACHE_KEY_PREFIX, route } from '@dish/api'

import { redisClient, redisDeletePattern } from './_redis'

export default route(async (req, res) => {
  console.warn('Clearing REDIS cache', req.query)
  if (req.query?.force) {
    await redisClient.flushall()
    res.send('force cleared ok')
    return
  } else {
    await redisDeletePattern(`${CACHE_KEY_PREFIX}*`)
  }
  res.send('ok')
})
