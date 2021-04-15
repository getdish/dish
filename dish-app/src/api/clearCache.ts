import { route } from '@dish/api'

import { redisClient } from './_rc'

export default route(() => {
  redisClient.flushall()
})
