import { join } from 'path'

import { route } from '@dish/api'
import { User, WithID, userFindOne, userUpsert } from '@dish/graph'
import { jwtSign } from '@dish/helpers-node'
import AppleSignIn, { AppleSignInOptions } from 'apple-sign-in-rest'

// with this library https://github.com/renarsvilnis/apple-sign-in-rest
// at end of implementation i found this library, slightly more maintained:
// may want to switch if we get issues:
// https://github.com/A-Tokyo/apple-signin-auth

export const redirectUri = 'https://dishapp.com/api/auth/appleAuthorize'
const rootPath = join(__dirname, '..', '..', '..')

let privateKeyPath = ''
try {
  privateKeyPath = join(rootPath, 'etc', 'AuthKey_M5CPALWBA5.p8')
} catch (err) {
  console.error('Error: loading privateKeyPath')
}

export const appleConfig: AppleSignInOptions = {
  clientId: 'com.dishapp',
  teamId: '399WY8X9HY',
  keyIdentifier: 'M5CPALWBA5',
  privateKeyPath,
}

export const appleSignIn = new AppleSignIn(appleConfig)
export const clientSecret = appleSignIn.createClientSecret({
  // expirationDuration: 5 * 60, // 5 minutes
})

export const authorizeRoute = route(async (req, res) => {
  let { user: reqUser, id_token, code, error } = req.body
  console.log('sign in response', JSON.stringify(req.body, null, 2))
  const tokens = await appleSignIn.getAuthorizationToken(clientSecret, code, {
    // Optional, use the same value which you passed to authorisation URL. In case of iOS you skip the value
    redirectUri,
  })

  const claim = await appleSignIn.verifyIdToken(tokens.id_token, {
    ignoreExpiration: true, // default is false
  })

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

  const token = jwtSign(user)

  if (isChrome) {
    return res.redirect(
      `https://dishapp.com/onboard?user=${encodeURIComponent(
        user.username!
      )}&token=${encodeURIComponent(token)}`
    )
  }

  return res.sendStatus(200)
})
