import { userUpdate } from '@dish/graph/src'

import { getUserFromRoute, secureRoute } from './_user'

export default secureRoute('user', async (req, res) => {
  const user = await getUserFromRoute(req)!
  const { username, about, location, charIndex } = req.body
  user.has_onboarded = true
  user.email = user.email ?? 'default@dishapp.com'
  if (about !== null) user.about = about
  if (location !== null) user.location = location
  if (charIndex !== null) user.charIndex = charIndex
  try {
    await userUpdate(user)
    res.json({
      email: user.email,
      has_onboarded: user.has_onboarded,
      about: user.about,
      location: user.location,
      charIndex: user.charIndex,
      username: user.username,
    })
  } catch (e) {
    res.status(409).send('failed')
    return
  }
})
