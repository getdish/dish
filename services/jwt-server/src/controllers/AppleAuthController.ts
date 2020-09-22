import { join } from 'path'

import { User, WithID, userFindOne, userUpsert } from '@dish/graph'
import AppleSignIn, { AppleSignInOptions } from 'apple-sign-in-rest'
import { Request, Response } from 'express'

// with this library https://github.com/renarsvilnis/apple-sign-in-rest
// at end of implementation i found this library, slightly more maintained:
// may want to switch if we get issues:
// https://github.com/A-Tokyo/apple-signin-auth

const redirectUri = 'https://dishapp.com/apple_authorize'
const config: AppleSignInOptions = {
  clientId: 'com.dishapp',
  teamId: '399WY8X9HY', // or dish.motion ?
  keyIdentifier: 'M5CPALWBA5',
  privateKeyPath: join(__dirname, '../../AuthKey_M5CPALWBA5.p8'),
}

const appleSignIn = new AppleSignIn(config)

class AppleAuthController {
  // should be called no more than once a day
  static refreshToken = async (req: Request, res: Response) => {
    // const { user_id } = req.body
    // const user = await userFindOne({ id: user_id })
    // const refreshTokenResponse = await appleSignIn.refreshAuthorizationToken(clientSecret, refreshToken);
    // const { access_token } = refreshTokenResponse.access_token;
    // TODO store access_token on user
  }

  static authCallback = async (req: Request, res: Response) => {
    console.log('sign in response', req.body)
    let { user: reqUser, id_token, code, state, error } = req.body

    if (!reqUser) {
      return res.status(400).send()
    }

    if (!reqUser.email) {
      console.error('no user email', reqUser.email)
      return res.status(400).send()
    }

    // if (req.session.state && req.session.state !== state) {
    //   throw new Error("Missing or invalid state");
    // }

    const clientSecret = appleSignIn.createClientSecret({
      // expirationDuration: 5 * 60, // 5 minutes
    })

    const tokenResponse = await appleSignIn.getAuthorizationToken(
      clientSecret,
      code,
      {
        // Optional, use the same value which you passed to authorisation URL. In case of iOS you skip the value
        redirectUri,
      }
    )

    const claim = await appleSignIn.verifyIdToken(tokenResponse.id_token, {
      // (Optional) verifies the nonce
      nonce: 'nonce',
      // (Optional) If you want to handle expiration on your own, useful in case of iOS as identityId can't be "refreshed"
      ignoreExpiration: true, // default is false
    })

    // TODO STORE INFO ON USER
    const apple_uid = claim.aud
    const apple_secret = clientSecret
    const apple_refresh_token = tokenResponse.refresh_token

    // user is passed on first signup
    let user: WithID<User> | null = null
    try {
      if (claim.aud) {
        user = await userFindOne({
          apple_uid,
        })
      } else {
        user = await userFindOne({
          apple_email: reqUser.email,
        })
      }
    } catch (error) {
      console.error('user find error', error)
      return res.status(401).send()
    }

    if (!user) {
      try {
        // first time, create user
        user = await userUpsert([
          {
            username: `${reqUser.name.firstName} ${reqUser.name.lastName}`,
            password: reqUser.code,
            email: reqUser.email,
            role: 'user',
          },
        ])[0]
      } catch (error) {
        console.error('user create error', error)
        return res.status(401).send()
      }
    }

    // add apple info
    const finalUser = await userUpsert([
      {
        ...user,
        apple_secret,
        apple_uid,
        apple_refresh_token,
      },
    ])

    console.log('finalUser', finalUser)

    return res.json({
      ok: true,
    })
  }
}

export default AppleAuthController
