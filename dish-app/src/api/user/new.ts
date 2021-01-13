import { route } from '@dish/api'
import { userInsert } from '@dish/graph'
import * as bcrypt from 'bcryptjs'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { username, email, password } = req.body

  try {
    await userInsert([
      {
        username,
        password: bcrypt.hashSync(password, 8),
        email: email,
        role: 'user',
      },
    ])
  } catch (err) {
    if (err.message.includes('Uniqueness violation')) {
      return res.status(409).json(['Username/email already in use'])
    }
    return res.status(400).json([err.message])
  }

  res.status(201).send('User created')
})
