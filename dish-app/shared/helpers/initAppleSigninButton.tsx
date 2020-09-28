import { isSafari } from '@dish/helpers'

import { isWeb } from '../constants'

export const initAppleSigninButton = () => {
  if (!isWeb) {
    return
  }

  // @ts-ignore
  AppleID.auth.init({
    clientId: 'com.dishapp',
    scope: 'name email',
    redirectURI: 'https://dishapp.com/auth/apple_authorize',
    usePopup: isSafari,
  })
}
