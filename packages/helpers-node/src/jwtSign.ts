import { JWT_SECRET, User } from '@dish/graph'
import jwt from 'jsonwebtoken'

export function jwtSign(user: Pick<User, 'username' | 'id' | 'role'>) {
  return jwt.sign(
    {
      username: user.username,
      userId: user.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-user-id': user.id,
        'x-hasura-allowed-roles': [user.role],
        'x-hasura-default-role': user.role,
      },
    },
    JWT_SECRET,
    { expiresIn: '1w' }
  )
}
