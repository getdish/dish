import { validate } from 'class-validator'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'

import config from '../config/config'
import { User } from '../models/User'

class AuthController {
  static login = async (req: Request, res: Response) => {
    let { username, password } = req.body

    if (!username || !password) {
      res.status(400).send()
    }

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (error) {
      try {
        user = await userRepository.findOneOrFail({
          where: { email: username },
        })
      } catch (error2) {
        console.error('failed logging in', error, error2)
        res.status(401).send()
        return
      }
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send()
      return
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user.id,
        'https://hasura.io/jwt/claims': {
          'x-hasura-user-id': user.id,
          'x-hasura-allowed-roles': [user.role],
          'x-hasura-default-role': user.role,
        },
      },
      config.jwtSecret,
      { expiresIn: '1w' }
    )

    if (process.env.NODE_ENV != 'test') {
      console.log('logging in', user)
    }

    //@ts-ignore
    delete user.password

    res.send({ user: user, token: token })
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const { username } = req.body
    if (!username) {
      res.status(400).send()
    }

    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ where: { username } })
    let payload: any
    if (user) {
      await user.sendPasswordResetEmail()
    }
    res.status(204).send()
  }

  static passwordReset = async (req: Request, res: Response) => {
    const { token, password } = req.body
    if (!token || !password) {
      res.status(400).send({ error: 'Missing fields' })
    }

    const userRepository = getRepository(User)
    let user: User | undefined
    try {
      user = await userRepository.findOne({
        where: { password_reset_token: token },
      })
    } catch (e) {
      console.error(e)
      res.status(401).send()
      return
    }

    if (!user) {
      res.status(401).send()
      return
    }

    const time_elapsed = AuthController.minutesSince(user.password_reset_date)
    if (time_elapsed > 60) {
      res.status(401).send({ error: 'Token out of date' })
      return
    }

    user.password = password
    user.hashPassword()
    await userRepository.save(user)
    res.status(201).send()
  }

  static minutesSince(date: Date) {
    let diff = (Date.now() - date.getTime()) / 1000
    diff /= 60
    return Math.abs(Math.round(diff))
  }
}
export default AuthController
