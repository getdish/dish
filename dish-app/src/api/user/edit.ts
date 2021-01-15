import { EditUserResponse, userUpdate } from '@dish/graph'

import { getUserFromRoute, secureRoute } from './_user'

export default secureRoute('user', async (req, res) => {
  const user = await getUserFromRoute(req)!
  const { about, location, charIndex } = req.body
  user.has_onboarded = true
  user.email = user.email ?? 'default@dishapp.com'
  if (about !== null) user.about = about
  if (location !== null) user.location = location
  if (charIndex !== null) user.charIndex = charIndex
  try {
    await userUpdate(user)
    const val: EditUserResponse = {
      email: user.email,
      has_onboarded: user.has_onboarded,
      about: user.about,
      location: user.location,
      charIndex: user.charIndex,
      username: user.username,
    }
    res.status(200).json(val)
  } catch (e) {
    res.status(409).json({ error: e.message })
    return
  }
})
