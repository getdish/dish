import { route } from '@dish/api'
import { MARTIN_TILES_HOST } from '@dish/graph'

const host = MARTIN_TILES_HOST

export default route(async (req, res) => {
  const url = `${host}${req.path}`
  console.log('fetch', url)
  const martinRes = await fetch(url).then((res) => res.json())

  console.log('got', url, martinRes)

  if (martinRes.attribution == null) {
    return res.send({
      ...martinRes,
      attribution: '',
    })
  }

  res.send(martinRes)
})
