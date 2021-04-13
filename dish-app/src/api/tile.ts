import { route } from '@dish/api'
import { TILES_HOST_INTERNAL } from '@dish/graph'

// TODO test in web app to see if it works there
// may be we need to forward some header info

export default route(async (req, res) => {
  const url = `${TILES_HOST_INTERNAL}${req.path}`
  const martinRes = await fetch(url).then((res) => res.json())
  if (process.env.LOCAL_HOST) {
    martinRes.tiles = martinRes.tiles?.map((tile) => {
      return tile.replace('localhost', process.env.LOCAL_HOST)
    })
  }
  if (martinRes.attribution == null) {
    res.send({
      ...martinRes,
      attribution: '',
    })
    return
  }
  res.send(martinRes)
})
