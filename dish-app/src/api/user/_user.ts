import { Handler, Req, Res, RouteExit, handleErrors } from '@dish/api'
import { JWT_SECRET, userFindOne } from '@dish/graph'
import * as jwt from 'jsonwebtoken'

type PermissionLevel = 'admin' | 'user' | 'contributor'

const access = {
  admin: ['admin', 'user', 'contributor'],
  contributor: ['contributor', 'user'],
  user: ['user'],
}

export function secureRoute(
  minimumPermission: PermissionLevel,
  route: Handler
) {
  return handleErrors(async (req, res) => {
    ensureJWT(req, res)
    await ensureRole(req, res, minimumPermission)
    await route(req, res)
  })
}

export async function getUserFromEmailOrUsername(login: string) {
  return login.includes('@')
    ? await userFindOne({ email: login })
    : await userFindOne({ username: login })
}

export async function getUserFromRoute(req: Req) {
  const { userId } = getJWT(req)
  return await userFindOne({ id: userId })
}

export async function ensureRole(
  req: Req,
  res: Res,
  minimumPermission: PermissionLevel
) {
  try {
    const user = await getUserFromRoute(req)
    if (!user) {
      throw new Error(`No user`)
    }
    const permissions = access[user.role]
    if (!permissions.includes(minimumPermission ?? 'contributor')) {
      throw new Error(`No permission`)
    }
  } catch (err) {
    console.error('ensureRole error', err)
    res.status(400).send(err)
    throw RouteExit
  }
}

export function ensureJWT(req: Req, res: Res) {
  const token = getJWT(req)
  if (!token) {
    console.log('expired/invlaid jwt')
    res.status(401).send('expired/invalid jwt')
    throw RouteExit
  }
  const { userId, username } = token
  const newToken = jwt.sign({ userId, username }, JWT_SECRET, {
    expiresIn: '180d',
  })
  // TODO??? HANDLE THIS ON CLIENT RIGHT???
  res.setHeader('jwt-refreshed-token', newToken)
}

function getJWT(req: Req) {
  const token = (req.headers['authorization'] ?? '').replace('Bearer ', '')
  try {
    const res = jwt.verify(token, JWT_SECRET) as {
      userId: string
      username: string
    }
    return res
  } catch (error) {
    return null
  }
}
