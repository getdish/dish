import { route } from '@dish/api'
import { userFindOne } from '@dish/graph'
import * as bcrypt from 'bcryptjs'

import { jwtSign } from '../_helpers'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { login, password } = req.body
  try {
    // try with username if not try with email
    const user =
      (await userFindOne({ username: login })?.[0]) ??
      (await userFindOne({ email: login })?.[0])
    if (!user) {
      return res.status(401).json({ error: 'Not found' })
    }
    const isValid = bcrypt.compareSync(password, user.password)
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
