import { route } from '@dish/api'
import { userFindOne } from '@dish/graph'
import { isPasswordValid, jwtSign } from '@dish/helpers-node'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { login, password } = req.body
  try {
    // try with username if not try with email
    const user =
      (await userFindOne({ username: login })) ??
      (await userFindOne({ email: login }))
    if (!user) {
      return res.status(404).json({ error: 'Not found' })
    }
    const isValid = isPasswordValid(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    const token = jwtSign(user)
    res.status(200).json({ user: { id: user.id }, token })
  } catch (err) {
    console.error(err)
    return res.status(400).json({ error: err.message })
  }
})
