import { route } from '@dish/api'
import { userFindOne, userUpdate } from '@dish/graph'
import { hashPassword } from '@dish/helpers-node'

export default route(async (req, res) => {
  if (req.method !== 'POST') return
  const { token, password } = req.body
  if (!token || !password) {
    res.status(400).send({ error: 'Missing fields' })
  }
  try {
    const user = await userFindOne({ password_reset_token: token })
    if (!user) {
      res.status(401).send()
      return
    }
    const elapsed = minutesSince(user.password_reset_date)
    if (elapsed > 60) {
      res.status(401).send({ error: 'Token out of date' })
      return
    }
    user.password = hashPassword(password)
    await userUpdate(user)
    return res.status(200)
  } catch (err) {
    console.error(err)
    return res.status(400).json({ error: err.message })
  }
})

function minutesSince(date: Date) {
  let diff = (Date.now() - date.getTime()) / 1000
  diff /= 60
  return Math.abs(Math.round(diff))
}
