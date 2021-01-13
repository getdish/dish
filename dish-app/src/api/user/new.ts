import { route } from '@dish/api'
import { userInsert } from '@dish/graph'
import * as bcrypt from 'bcryptjs'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { username, email, password } = req.body
  try {
    const [user] = await userInsert([
      {
        username,
        password: bcrypt.hashSync(password, 8),
        email: email,
        role: 'user',
      },
    ])
    res.status(201).json({
      success: 'User created',
      user: {
        id: user.id,
      },
    })
  } catch (err) {
    console.error(err)
    if (err.message.includes('Uniqueness violation')) {
      return res.status(409).json({ error: 'Username/email already in use' })
    }
    return res.status(400).json({ error: err.message })
  }
})
