import { route } from '@dish/api'

import { redisClient } from './_redis'

export default route((req, res) => {
  redisClient.flushall()
  res.send('ok')
})
