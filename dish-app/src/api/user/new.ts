import { jsonRoute } from '@dish/api'
import { userInsert } from '@dish/graph'
import { hashPassword, jwtSign } from '@dish/helpers-node'

export default jsonRoute(async (req, res) => {
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
    const token = jwtSign(user)

    res.status(201).json({
      success: 'Welcome!',
      token,
      user: {
        id: user.id,
      },
    })
  } catch (err) {
    console.error(err)
    if (err.message.includes('Uniqueness violation')) {
      res.status(409).json({ error: 'Username/email already in use' })
      return
    }
    res.status(400).json({ error: err.message })
  }
})
