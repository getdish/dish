import loadable from '@loadable/component'
import { VStack } from 'snackui'

import { isSSR, isWeb } from '../../constants/constants'

export const SignInAppleButton = () => {
  return (
    <VStack width={230} height={60}>
      <SignInAppleButtonInner />
    </VStack>
  )
}

const SignInAppleButtonInner =
  isSSR || !isWeb
    ? () => null
    : loadable(() => import('./SignInAppleButtonContents'))
