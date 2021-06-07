import { route } from '@dish/api'

import { host, tilesHost, tilesPublicHost } from './_constants'

export default route((_, res) => {
  res.send({
    host: host,
    tilesHost: tilesHost,
    tilesPublicHost: tilesPublicHost,
  })
})
