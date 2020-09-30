import { Auth } from '@dish/graph'
import { HStack, Text, Toast, VStack } from '@dish/ui'
import React from 'react'

import { AppleLogoWhite } from './AppleLogoWhite'

export const SignInAppleButton = () => {
  return (
    <VStack
      borderRadius={9}
      borderColor="rgba(255,255,255,0.15)"
      borderWidth={2}
      cursor="pointer"
      overflow="hidden"
      hoverStyle={{
        borderColor: 'rgba(255,255,255,0.3)',
      }}
      onPress={async () => {
        // @ts-ignore
        const res = AppleID.auth.signIn()
        if (!res) return // in-browser
        const { authorization } = await res
        const [status] = await Auth.appleAuth(authorization)
        if (status == 200) {
          Toast.show('Logged in!')
        } else {
          Toast.show('Error loggin in 😭', { type: 'error' })
        }
      }}
    >
      <HStack paddingRight={20} backgroundColor="#000" alignItems="center">
        <AppleLogoWhite />
        <Text color="#fff" fontSize={18} fontWeight="500">
          Sign in with Apple
        </Text>
      </HStack>
    </VStack>
  )
}
