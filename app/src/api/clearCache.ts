import { route } from '@dish/api'

import { redisClient } from './_rc'

export default route((req, res) => {
  redisClient.flushall()
  res.send('ok')
})
