import { ApplePlace } from '../src/types/homeTypes'
import { ensureSecureRoute, getUserFromRoute } from './user/_user'
import { route } from '@dish/api'
import { Restaurant, restaurantUpsert } from '@dish/graph'
import { assertPresent } from '@dish/helpers'

export default route(async (req, res) => {
  await ensureSecureRoute(req, res, 'user')
  const user = await getUserFromRoute(req)
  if (!user) {
    res.json({
      error: 'no user',
    })
    return
  }
  const body = req.body.data as ApplePlace
  if (!body) {
    res.json({
      error: `No body data`,
    })
    return
  }
  assertPresent(body.name, 'name present')
  assertPresent(body.coordinate, 'coordinate present')
  assertPresent(body.formattedAddress, 'formattedAddress present')
  assertPresent(body.postCode, 'postCode present')
  const restaurant: Partial<Restaurant> = {
    name: body.name,
    location: {
      type: 'Point',
      coordinates: [body.coordinate.longitude, body.coordinate.latitude],
    },
    address: body.formattedAddress,
    telephone: body.telephone,
    zip: body.postCode,
    external_source_info: body,
  }
  const [inserted] = await restaurantUpsert([restaurant])
  if (!inserted) {
    res.json({
      error: `Didn't insert`,
    })
    return
  }
  res.json({
    ok: true,
    item: inserted[0],
  })
})
