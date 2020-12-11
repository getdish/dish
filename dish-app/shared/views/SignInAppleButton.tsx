import loadable from '@loadable/component'

import { isSSR, isWeb } from '../constants'

export const SignInAppleButton =
  isSSR || !isWeb
    ? () => null
    : loadable(() => import('./SignInAppleButtonContents'))
