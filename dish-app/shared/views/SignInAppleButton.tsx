// debug
import { HStack, Text, VStack } from '@dish/ui'
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
      onPress={() => {
        // @ts-ignore
        const x = AppleID.auth.signIn()
        console.log('x', x)
        x?.then((data) => {
          console.log('got', data)
        })
      }}
    >
      <HStack paddingRight={20} backgroundColor="#000" alignItems="center">
        <AppleLogoWhite />
        <Text color="#fff" fontSize={18}>
          Sign in with Apple
        </Text>
      </HStack>
    </VStack>
  )
}
