import { route, runMiddleware, useRouteBodyParser } from '@dish/api'
import { restaurantUpsert, userUpdate } from '@dish/graph'

import { ensureSecureRoute, getUserFromRoute } from './user/_user'

export default route(async (req, res) => {
  await ensureSecureRoute(req, res, 'user')
  const user = await getUserFromRoute(req)
  if (!user) {
    res.json({
      error: 'no user',
    })
    return
  }
  const { body } = req
  console.log('body', body)

  const restaurant = {
    name: body.name,
  }

  await restaurantUpsert([{}])

  res.json({
    ok: true,
  })
})
