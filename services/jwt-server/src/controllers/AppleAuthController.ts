import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../models/User'

class AppleAuthController {
  static authCallback = async (req: Request, res: Response) => {
    let { user, id_token, code, error } = req.body
    console.log('got payload', req.body)

    if (!user.email) {
      res.status(400).send()
    }

    const userRepository = getRepository(User)
    let authUser: User | undefined
    try {
      authUser = await userRepository.findOne({ where: { email: user.email } })
    } catch (error) {
      console.error(error)
      res.status(401).send()
      return
    }

    if (!authUser) {
      // first time, create user
      authUser = new User()
      authUser.username = `${user.name.firstName} ${user.name.lastName}`
      authUser.password = user.code
      authUser.email = user.email
      authUser.role = 'user'
      const errors = await validate(user)
      if (errors.length > 0) {
        res.status(400).send(errors)
        return
      }
      try {
        await userRepository.save(user)
      } catch (e) {
        console.error(e)
        res.status(409).send('Username already in use')
        return
      }
    }

    res.send({ user: user, token: id_token })
  }
}

export default AppleAuthController
