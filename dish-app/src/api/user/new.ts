import { route } from '@dish/api'
import { userInsert } from '@dish/graph'
import { hashPassword } from '@dish/helpers-node'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { username, email, password } = req.body
  try {
    const [user] = await userInsert([
      {
        username,
        password: hashPassword(password),
        email: email,
        role: 'user',
      },
    ])
    res.status(201).json({
      success: 'Welcome!',
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
