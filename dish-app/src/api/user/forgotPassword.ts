import { jsonRoute } from '@dish/api'
import { userUpdate } from '@dish/graph'
import { v4 } from 'uuid'

import { send } from '../_mailer'
import { getUserFromEmailOrUsername } from './_user'

export default jsonRoute(async (req, res) => {
  if (req.method !== 'POST') return
  const { login } = req.body
  try {
    const user = await getUserFromEmailOrUsername(login)
    if (user) {
      const token = v4()
      user.password_reset_token = token
      user.password_reset_date = new Date()
      await userUpdate(user)
      await sendPasswordResetEmail(user.email, token)
    }
    res.status(204)
    return
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
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
