import { route } from '@dish/api'
import { TILES_HOST_INTERNAL } from '@dish/graph'

// TODO test in web app to see if it works there
// may be we need to forward some header info

const origin = `http://${TILES_HOST_INTERNAL}`

export default route(async (req, res) => {
  const url = `${origin}${req.path}`
  const martinRes = await fetch(url).then((res) => res.json())
  martinRes.tiles = martinRes.tiles?.map((tile) => {
    if (process.env.LOCAL_HOST) {
      return tile.replace(TILES_HOST_INTERNAL, process.env.LOCAL_HOST)
    }
    if (process.env.MARTIN_ENDPOINT) {
      return tile.replace(origin, process.env.MARTIN_ENDPOINT)
    }
    return tile
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
