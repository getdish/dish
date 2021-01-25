import { jsonRoute } from '@dish/api'
import { userFindOne, userUpdate } from '@dish/graph'
import { hashPassword } from '@dish/helpers-node'

export default jsonRoute(async (req, res) => {
  if (req.method !== 'POST') return
  const { token, password } = req.body
  if (!token || !password) {
    res.status(400).send({ error: 'Missing fields' })
    return
  }
  try {
    const user = await userFindOne({ password_reset_token: token })
    if (!user) {
      res.status(401).send()
      return
    }
    if (!user.password_reset_date) {
      res.status(401).json({ error: `No password reset requested` })
      return
    }
    const elapsed = minutesSince(new Date(user.password_reset_date))
    if (elapsed > 60) {
      res.status(401).json({ error: 'Token out of date' })
      return
    }
    if (!password || password.length < 7) {
      res.status(401).json({ error: 'Password must be at least 8 characters' })
      return
    }
    user.password = hashPassword(password)
    await userUpdate(user)
    res.status(200).json({ success: 'Reset password success' })
    return
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

function minutesSince(date: Date) {
  let diff = (Date.now() - date.getTime()) / 1000
  diff /= 60
  return Math.abs(Math.round(diff))
}
