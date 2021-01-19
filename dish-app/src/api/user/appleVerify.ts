import { route } from '@dish/api'
import { userFindOne } from '@dish/graph'
import { jwtSign } from '@dish/helpers-node'

import { appleAuth } from './_apple'

export default route(async (req, res) => {
  const { id_token, code, redirectUri } = req.body
  if (!id_token || !code) {
    return res.sendStatus(500)
  }
  const { claim } = await appleAuth({
    code,
    redirectUri,
  })
  const user = await userFindOne({ apple_uid: claim.email })
  if (!user) {
    console.error('no user')
    return res.sendStatus(500)
  }
  res.json({
    token: jwtSign(user),
    user: {
      id: user.id,
      username: user.username,
      location: user.location,
      about: user.about,
      avatar: user.avatar,
    },
  })
})

// static getAuthUrl = async (req: Request, res: Response) => {
//   const authorizationUrl = appleSignIn.getAuthorizationUrl({
//     // @ts-ignore
//     scope: ['name', 'email'],
//     redirectUrl: redirectUri,
//   })
//   res.json({ authorizationUrl })
// }

// // should be called no more than once a day
// static refreshToken = async (req: Request, res: Response) => {
//   // const { user_id } = req.body
//   // const user = await userFindOne({ id: user_id })
//   // const refreshTokenResponse = await appleSignIn.refreshAuthorizationToken(clientSecret, refreshToken);
//   // const { access_token } = refreshTokenResponse.access_token;
//   // TODO store access_token on user
// }
