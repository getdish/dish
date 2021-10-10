import { CACHE_KEY_PREFIX, route } from '@dish/api'

import { redisClient, redisDeletePattern } from './_redis'

export default route((req, res) => {
  console.warn('Clearing REDIS cache')
  if (req.params.force) {
    redisDeletePattern(``)
  } else {
    redisDeletePattern(`${CACHE_KEY_PREFIX}*`)
  }
  res.send('ok')
})
