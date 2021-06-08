import { basename } from 'path'

import { route } from '@dish/api'
import { TILES_HOST_INTERNAL } from '@dish/graph'
import proxy from 'express-http-proxy'

import { tilesHost, tilesPublicHost } from './_constants'

// TODO test in web app to see if it works there
// may be we need to forward some header info

const proxyHandler = proxy(TILES_HOST_INTERNAL)

export default route(async (req, res, next) => {
  const url = `${tilesHost}${req.path}`

  console.log('???', tilesHost, tilesPublicHost)

  if (req.path.includes('.pbf')) {
    return proxyHandler(req, res, next)
  }

  const martinRes = await fetch(url).then((res) => res.json())

  if (url.endsWith('json')) {
    martinRes.id = basename(req.path).replace('.', '').replace('.json', '')
  }

  martinRes.tiles = martinRes.tiles?.map((tile) => {
    if (process.env.LOCAL_HOST) {
      return tile.replace(/http:\/\/[^\/]+\//, `${tilesPublicHost}/`)
    } else {
      return tile.replace(tilesHost, tilesPublicHost)
    }
  })

  if (martinRes.attribution == null) {
    res.send({
      ...martinRes,
      attribution: '',
    })
    return
  }

  res.send(martinRes)
})
