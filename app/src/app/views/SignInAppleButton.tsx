import { YStack } from '@dish/ui'

import { SignInAppleButtonContents } from './SignInAppleButtonContents'

export const SignInAppleButton = () => {
  return (
    <YStack
      className="ease-in-out-fast"
      width={230}
      height={60}
      scale={0.85}
      hoverStyle={{
        scale: 0.875,
      }}
      pressStyle={{
        scale: 0.8,
      }}
    >
      <SignInAppleButtonContents />
    </YStack>
  )
}
