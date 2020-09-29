import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

import config from '../config/config'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers['auth']
  let jwtPayload

  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret)
    res.locals.jwtPayload = jwtPayload
  } catch (error) {
    res.status(401).send()
    return
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: '1h',
  })
  res.setHeader('token', newToken)

  //Call the next middleware or controller
  next()
}
