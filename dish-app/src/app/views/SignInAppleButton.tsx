import loadable from '@loadable/component'
import { VStack } from 'snackui'

import { isSSR, isWeb } from '../../constants/constants'

export const SignInAppleButton = () => {
  return (
    <VStack
      className="ease-in-out-fast"
      width={230}
      height={60}
      transform={[{ scale: 0.85 }]}
      hoverStyle={{
        transform: [{ scale: 0.875 }],
      }}
      pressStyle={{
        transform: [{ scale: 0.8 }],
      }}
    >
      <SignInAppleButtonInner />
    </VStack>
  )
}

const SignInAppleButtonInner =
  isSSR || !isWeb
    ? () => null
    : loadable(() => import('./SignInAppleButtonContents'))
