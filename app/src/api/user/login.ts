import { getUserFromEmailOrUsername } from './_user'
import { jsonRoute } from '@dish/api'
import { isPasswordValid, jwtSign } from '@dish/helpers-node'

export default jsonRoute(async (req, res) => {
  if (req.method !== 'POST') {
    res.send(200)
    return
  }
  const { login, password } = req.body
  try {
    const user = await getUserFromEmailOrUsername(login)
    if (!user) {
      res.status(401).json({ error: 'Not found' })
      return
    }
    console.log('compare', password, user.password)
    const isValid = isPasswordValid(password, user.password!)
    console.log('isValid', isValid)
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
