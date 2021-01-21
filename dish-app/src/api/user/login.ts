import { jsonRoute } from '@dish/api'
import { isPasswordValid, jwtSign } from '@dish/helpers-node'

import { getUserFromEmailOrUsername } from './_user'

export default jsonRoute(async (req, res) => {
  if (req.method !== 'POST') return
  const { login, password } = req.body
  try {
    const user = await getUserFromEmailOrUsername(login)
    if (!user) {
      res.status(401).json({ error: 'Not found' })
      return
    }
    const isValid = isPasswordValid(password, user.password)
    if (!isValid) {
      res.status(401).json({ error: 'Invalid password' })
      return
    }
    const token = jwtSign(user)
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
      },
      token,
      success: 'Welcome!',
    })
  } catch (err) {
    console.error('login err', err, req.body)
    res.status(400).json({ error: err.message })
  }
})