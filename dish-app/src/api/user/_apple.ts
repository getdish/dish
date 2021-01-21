import { join } from 'path'

import { urlEncodedRoute } from '@dish/api'
import { User, WithID, userFindOne, userUpsert } from '@dish/graph'
import { jwtSign } from '@dish/helpers-node'
import AppleSignIn, { AppleSignInOptions } from 'apple-sign-in-rest'

// with this library https://github.com/renarsvilnis/apple-sign-in-rest
// at end of implementation i found this library, slightly more maintained:
// may want to switch if we get issues:
// https://github.com/A-Tokyo/apple-signin-auth

export const redirectUri = 'https://dishapp.com/api/auth/appleAuthorize'
const rootPath = join(__dirname, '..', '..', '..')

const privateKeyPath = join(rootPath, 'etc', 'AuthKey_M5CPALWBA5.p8')
export const appleConfig: AppleSignInOptions = {
  clientId: 'com.dishapp',
  teamId: '399WY8X9HY',
  keyIdentifier: 'M5CPALWBA5',
  privateKeyPath,
}

let appleSignIn: AppleSignIn | null = null
let clientSecret: string | null = null

export async function appleAuth({
  code,
  redirectUri,
}: {
  code: string
  redirectUri?: string
}) {
  if (!appleSignIn) {
    try {
      appleSignIn = new AppleSignIn(appleConfig)
      clientSecret = appleSignIn.createClientSecret({
        // expirationDuration: 5 * 60, // 5 minutes
      })
    } catch (err) {
      console.log('error setting up apple sign in', appleConfig)
      throw err
    }
  }
  const tokens = await appleSignIn.getAuthorizationToken(clientSecret, code, {
    // Optional, use the same value which you passed to authorisation URL. In case of iOS you skip the value
    redirectUri,
  })
  const claim = await appleSignIn.verifyIdToken(tokens.id_token, {
    ignoreExpiration: true, // default is false
  })
  return {
    tokens,
    claim,
  }
}

export const authorizeRoute = urlEncodedRoute(
  async (req, res) => {
    let { user: reqUser, id_token, code, error } = req.body
    console.log('sign in response', JSON.stringify(req.body, null, 2))
    const { claim, tokens } = await appleAuth({
      code,
      redirectUri,
    })
    const apple_token = tokens.access_token
    const apple_refresh_token = tokens.refresh_token
    const isChrome = req.path.includes('_chrome')
    const sendResponse = (success?: boolean) => {
      if (isChrome) {
        if (!success) {
          res.send(
            `<html><body><script>window.opener.AuthChildMessage('fail')</script></body></html>`
          )
          return
        } else {
          res.send(
            `<html><body><script>window.opener.AuthChildMessage('success')</script></body></html>`
          )
          return
        }
      }
      if (!success) {
        res.sendStatus(500)
        return
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
      sendResponse(false)
      return
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
        sendResponse(false)
        return
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
      sendResponse(false)
      return
    }

    if (!user) {
      console.error('no user?')
      sendResponse(false)
      return
    }

    const token = jwtSign(user)

    if (isChrome) {
      return res.redirect(
        `https://dishapp.com/onboard?user=${encodeURIComponent(
          user.username!
        )}&token=${encodeURIComponent(token)}`
      )
    }

    res.sendStatus(200)
  },
  {
    extended: false,
  }
)
