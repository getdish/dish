import {
  Handler,
  Req,
  Res,
  RouteExit,
  handleErrors,
  wrapRoute,
} from '@dish/api'
import { userFindOne } from '@dish/graph/src'
import * as jwt from 'jsonwebtoken'

type PermissionLevel = 'admin' | 'user' | 'contributor'

const permissionsByUser = {
  admin: ['admin', 'user', 'contributor'],
  user: ['user', 'contributor'],
  contributor: ['user', 'contributor'],
}

export function secureRoute(
  minimumPermission: PermissionLevel,
  route: Handler
) {
  return wrapRoute(route, (fn) => {
    return handleErrors(async (req, res, next) => {
      ensureJWT(req, res)
      await ensureRole(req, res, minimumPermission)
      await fn(req, res, next)
    })
  })
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
    const permission = permissionsByUser[minimumPermission ?? 'admin']
    if (!permission.includes(user.role)) {
      throw new Error(`No permission`)
    }
  } catch (err) {
    res.status(400).send(err)
    throw RouteExit
  }
}

export function ensureJWT(req: Req, res: Res) {
  const token = getJWT(req)
  if (!token) {
    throw RouteExit
  }
  const { userId, username } = token
  const newToken = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: '180d',
  })
  // TODO??? HANDLE THIS ON CLIENT RIGHT???
  res.setHeader('jwt-refreshed-token', newToken)
}

function getJWT(req: Req) {
  const token = (req.headers['authorization'] ?? '').replace('Bearer ', '')
  try {
    const res = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string
      username: string
    }
    return res
  } catch (error) {
    return null
  }
}
