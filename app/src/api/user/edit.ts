import { useRouteBodyParser } from '@dish/api'
import { EditUserResponse, userUpdate } from '@dish/graph'

import { ensureUserOnRoute, secureRoute } from './_user'

export default secureRoute('user', async (req, res) => {
  await useRouteBodyParser(req, res, { json: { limit: 2048 } })
  const user = await ensureUserOnRoute(req)
  const { about, location, charIndex, name } = req.body
  const nextUser = {
    ...user,
    has_onboarded: true,
    email: user.email ?? 'default@dishapp.com',
    name: name ?? user.name,
    about: about ?? user.about,
    location: location ?? user.location,
    charIndex: charIndex ?? user.charIndex,
  }
  try {
    const newUser = await userUpdate(nextUser)
    const val: EditUserResponse = {
      email: newUser.email ?? '',
      has_onboarded: newUser.has_onboarded ?? false,
      about: newUser.about ?? '',
      location: newUser.location ?? 'nowhere',
      charIndex: charIndex,
      username: newUser.username!,
      name: newUser.name ?? '',
    }
    res.json(val)
  } catch (e) {
    res.status(409).json({ error: e.message })
    return
  }
})
