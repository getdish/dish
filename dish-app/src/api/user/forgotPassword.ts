import { route } from '@dish/api'
import { userFindOne, userUpdate } from '@dish/graph'
import { v4 } from 'uuid'

import { send } from '../_mailer'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { login } = req.body
  try {
    // try with username if not try with email
    const user =
      (await userFindOne({ username: login })) ??
      (await userFindOne({ email: login }))
    if (user) {
      const token = v4()
      user.password_reset_token = token
      user.password_reset_date = new Date()
      await userUpdate(user)
      await sendPasswordResetEmail(user.email, token)
    }
    return res.status(204)
  } catch (err) {
    console.error(err)
    return res.status(400).json({ error: err.message })
  }
})

async function sendPasswordResetEmail(email: string, token: string) {
  await send(
    this.email,
    'Dish: Password reset',
    `
  Dear ${this.username},

  Please follow this link to reset your password:

  https://dishapp.com/password-reset/${token}

  The Dish Team
`
  )
}
