import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import config from '../config/config'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = (<string>req.headers['authorization'] ?? '').replace(
    'Bearer ',
    ''
  )
  let jwtPayload

  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret)
    res.locals.jwtPayload = jwtPayload
  } catch (error) {
    res.status(401).send()
    return
  }

  //The token is valid for 1 day
  //We want to send a new token on every request
  const { userId, username } = jwtPayload
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: '1d',
  })

  //Call the next middleware or controller
  next()
}
