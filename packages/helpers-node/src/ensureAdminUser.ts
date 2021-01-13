import { userFindOne, userInsert, userUpdate } from '@dish/graph'

import { hashPassword } from './hashPassword'

const DEFAULT_PASSWORD = 'password'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD
if (
  process.env.DISH_ENV == 'production' &&
  ADMIN_PASSWORD == DEFAULT_PASSWORD
) {
  throw new Error('Default admin password being used in production')
}

export async function ensureAdminUser() {
  let user = await userFindOne({ username: 'admin' })
  if (!user) {
    await userInsert([
      {
        username: 'admin',
        email: 'team@dishapp.com',
        role: 'admin',
        password: hashPassword(ADMIN_PASSWORD),
      },
    ])
  } else {
    user.password = hashPassword(ADMIN_PASSWORD)
    await userUpdate(user)
  }
}
