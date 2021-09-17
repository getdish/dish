import { CACHE_KEY_PREFIX, route } from '@dish/api'

import { redisDeletePattern } from './_rc'

export default route((_req, res) => {
  console.warn('Clearing REDIS cache')
  redisDeletePattern(`${CACHE_KEY_PREFIX}*`)
  res.send('ok')
})
