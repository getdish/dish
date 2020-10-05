import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../models/User'

const permissionsByUser = {
  admin: ['admin', 'user', 'contributor'],
  user: ['user', 'contributor'],
  contributor: ['user', 'contributor'],
}

export async function getUserFromResponse(res: Response) {
  //Get the user ID from previous midleware
  const id = res.locals.jwtPayload.userId

  //Get user role from the database
  const userRepository = getRepository(User)
  try {
    return {
      user: await userRepository.findOneOrFail(id),
      error: null,
    }
  } catch (error) {
    return {
      error,
      user: null,
    }
  }
}

export const checkRole = (roles: Array<string>) => {
  return async (_: Request, res: Response, next: NextFunction) => {
    const { user, error } = await getUserFromResponse(res)
    if (user) {
      const permission = permissionsByUser[user.role] ?? ['none']
      // Check if array of authorized roles includes the user's role
      if (permission.includes(user.role)) {
        next()
      } else {
        res.status(401).send('no permission')
      }
    } else {
      res.status(401).send(error)
    }
  }
}
