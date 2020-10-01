import { join } from 'path'

import { User, WithID, userFindOne, userUpsert } from '@dish/graph'
import AppleSignIn, { AppleSignInOptions } from 'apple-sign-in-rest'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import config from '../config/config'

// with this library https://github.com/renarsvilnis/apple-sign-in-rest
// at end of implementation i found this library, slightly more maintained:
// may want to switch if we get issues:
// https://github.com/A-Tokyo/apple-signin-auth

const redirectUri = 'https://dishapp.com/auth/apple_authorize'
const appleConfig: AppleSignInOptions = {
  clientId: 'com.dishapp',
  teamId: '399WY8X9HY', // or dish.motion ?
  keyIdentifier: 'M5CPALWBA5',
  privateKeyPath: join(__dirname, '../../AuthKey_M5CPALWBA5.p8'),
}

const appleSignIn = new AppleSignIn(appleConfig)
const clientSecret = appleSignIn.createClientSecret({
  // expirationDuration: 5 * 60, // 5 minutes
})

const createToken = (user: User) => {
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
    config.jwtSecret,
    { expiresIn: '100w' }
  )
}

class AppleAuthController {
  static getAuthUrl = async (req: Request, res: Response) => {
    const authorizationUrl = appleSignIn.getAuthorizationUrl({
      // @ts-ignore
      scope: ['name', 'email'],
      redirectUrl: redirectUri,
    })
    res.json({ authorizationUrl })
  }

  // should be called no more than once a day
  static refreshToken = async (req: Request, res: Response) => {
    // const { user_id } = req.body
    // const user = await userFindOne({ id: user_id })
    // const refreshTokenResponse = await appleSignIn.refreshAuthorizationToken(clientSecret, refreshToken);
    // const { access_token } = refreshTokenResponse.access_token;
    // TODO store access_token on user
  }

  static verify = async (req: Request, res: Response) => {
    const { id_token, code, redirectUri } = req.body
    if (!id_token || !code) return res.sendStatus(500)
    const tokens = await appleSignIn.getAuthorizationToken(clientSecret, code, {
      // Optional, use the same value which you passed to authorisation URL. In case of iOS you skip the value
      redirectUri,
    })
    const claim = await appleSignIn.verifyIdToken(tokens.id_token, {
      ignoreExpiration: true, // default is false
    })
    const user = await userFindOne({ apple_uid: claim.email })
    if (!user) {
      console.error('no user')
      return res.sendStatus(500)
    }
    res.json({
      token: createToken(user),
      user: {
        username: user.username,
        location: user.location,
        about: user.about,
        avatar: user.avatar,
      },
    })
  }

  static authCallback = async (req: Request, res: Response) => {
    let { user: reqUser, id_token, code, error } = req.body
    console.log('sign in response', JSON.stringify(req.body, null, 2))

    const tokens = await appleSignIn.getAuthorizationToken(clientSecret, code, {
      // Optional, use the same value which you passed to authorisation URL. In case of iOS you skip the value
      redirectUri,
    })

    const claim = await appleSignIn.verifyIdToken(tokens.id_token, {
      ignoreExpiration: true, // default is false
    })

    // TODO STORE INFO ON USER
    const apple_token = tokens.access_token
    const apple_secret = clientSecret
    const apple_refresh_token = tokens.refresh_token

    console.log('got', {
      apple_secret,
      apple_token,
      id_token,
      apple_refresh_token,
      tokenResponse: tokens.id_token,
    })

    const isChrome = req.path.includes('_chrome')
    const sendResponse = (success?: boolean) => {
      if (isChrome) {
        if (!success) {
          return res.send(
            `<html><body><script>window.opener.AuthChildMessage('fail')</script></body></html>`
          )
        } else {
          return res.send(
            `<html><body><script>window.opener.AuthChildMessage('success')</script></body></html>`
          )
        }
      }
      if (!success) {
        return res.sendStatus(500)
      } else {
        return
      }
    }

    // user is passed on first signup
    let user: WithID<User> | null = null
    try {
      if (claim.email) {
        user = await userFindOne({
          apple_uid: claim.email,
        })
      } else {
        user = await userFindOne({
          apple_email: reqUser.email,
        })
      }
    } catch (error) {
      console.error('user find error', error)
      return sendResponse(false)
    }

    if (!user) {
      try {
        // first time, create user
        user = await userUpsert([
          {
            username: `${reqUser.name.firstName} ${reqUser.name.lastName}`,
            password: reqUser.code,
            email: reqUser.email ?? claim.email,
            role: 'user',
          },
        ])[0]
      } catch (error) {
        console.error('user create error', error)
        return sendResponse(false)
      }
    }

    // add apple info
    try {
      const finalUser = await userUpsert([
        {
          ...user,
          apple_token,
          apple_uid: claim.email,
          apple_refresh_token,
        },
      ])
      if (finalUser[0]) {
        user = finalUser[0]
      }
    } catch (err) {
      console.error('final user update error', error)
      return sendResponse(false)
    }

    if (!user) {
      console.error('no user?')
      return sendResponse(false)
    }

    const token = createToken(user)

    if (isChrome) {
      return res.redirect(
        `https://dishapp.com/onboard?user=${encodeURIComponent(
          user.username!
        )}&token=${encodeURIComponent(token)}`
      )
    }

    return res.sendStatus(200)
  }
}

export default AppleAuthController
