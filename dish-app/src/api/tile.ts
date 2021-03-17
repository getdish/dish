import { route } from '@dish/api'
import { MARTIN_TILES_HOST } from '@dish/graph'

const host = MARTIN_TILES_HOST

// TODO test in web app to see if it works there
// may be we need to forward some header info

export default route(async (req, res) => {
  const url = `${host}${req.path}`
  const martinRes = await fetch(url).then((res) => res.json())
  if (martinRes.attribution == null) {
    res.send({
      ...martinRes,
      attribution: '',
    })
    return
  }
  res.send(martinRes)
})
