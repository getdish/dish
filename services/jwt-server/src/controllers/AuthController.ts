import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../models/User'
import config from '../config/config'

class AuthController {
  static login = async (req: Request, res: Response) => {
    let { username, password } = req.body
    if (!(username && password)) {
      res.status(400).send()
    }

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (error) {
      res.status(401).send()
      return
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send()
      return
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    )

    res.send(token)
  }

  static changePassword = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId

    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
      res.status(400).send()
    }

    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (id) {
      res.status(401).send()
      return
    }

    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send()
      return
    }

    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }
    user.hashPassword()
    userRepository.save(user)

    res.status(204).send()
  }
}
export default AuthController
