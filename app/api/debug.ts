import { route } from '@dish/api'
import { DISH_API_ENDPOINT } from '@dish/graph'

import { host, tilesHost, tilesPublicHost } from './_constants'

export default route((_, res) => {
  res.send({
    host: host,
    tilesHost: tilesHost,
    tilesPublicHost: tilesPublicHost,
    DISH_API_ENDPOINT,
  })
})
