import { jsonRoute } from '@dish/api'
import { User, getUserName, userUpdate } from '@dish/graph'
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
      if (user.email) {
        // dont await
        sendPasswordResetEmail(user, token)
      } else {
        throw new Error(`no email`)
      }
    }
    res.status(204).json({ success: 'Reset password' })
    return
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

async function sendPasswordResetEmail(user: User, token: string) {
  if (!user.email || !user.username) {
    console.warn('emtpy user info')
    return
  }
  await send(
    user.email,
    'Dish: Password reset',
    `
  Dear ${getUserName(user)},

  Please follow this link to reset your password:

  https://dishapp.com/password-reset/${token}

  The Dish Team
`
  )
}
