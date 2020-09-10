import { join } from 'path'

import appleSignin from 'apple-signin'
import { validate } from 'class-validator'
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import { User } from '../models/User'

// working off this example: https://github.com/Techofficer/express-apple-signin

const config = {
  client_id: 'com.dishapp',
  team_id: '399WY8X9HY', // or dish.motion ?
  key_identifier: 'M5CPALWBA5',
  redirect_uri: 'https://dishapp.com/apple_authorize',
}

class AppleAuthController {
  static authCallback = async (req: Request, res: Response) => {
    let { user, id_token, code, error } = req.body

    const clientSecret = appleSignin.getClientSecret({
      clientID: config.client_id,
      teamId: config.team_id,
      keyIdentifier: config.key_identifier,
      privateKeyPath: join(__dirname, '../../AuthKey_M5CPALWBA5.p8'),
    })

    const tokens = await appleSignin.getAuthorizationToken(code, {
      clientID: config.client_id,
      clientSecret,
      redirectUri: config.redirect_uri,
    })

    if (!tokens.id_token) {
      return res.sendStatus(500)
    }

    const data = await appleSignin.verifyIdToken(tokens.id_token)

    console.log('now we have', data)

    // user is passed on first signup
    if (user) {
      // signing up
      if (!user.email) {
        res.status(400).send()
      }

      const userRepository = getRepository(User)
      let authUser: User | undefined
      try {
        authUser = await userRepository.findOne({
          where: { email: user.email },
        })
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
    }

    return res.json({
      id: data.sub,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    })
  }
}

export default AppleAuthController
