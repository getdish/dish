import { Auth } from '@dish/graph'
import { sleep } from '@o/async'
import React, { useState } from 'react'
import { HStack, Text, Toast, VStack } from 'snackui'

import { useIsMountedRef } from '../helpers/useIsMountedRef'
import { AppleLogoWhite } from './AppleLogoWhite'

export const SignInAppleButton = () => {
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMountedRef()
  return (
    <VStack
      onPress={async () => {
        setLoading(true)
        setTimeout(() => {
          if (isMounted.current) {
            setLoading(false)
          }
        }, 3000)
        await sleep(40)
        const { auth } = require('../../web/apple-sign-in')
        const res = auth.signIn()
        if (!res) return // in-browser
        try {
          const { authorization } = await res
          const [status] = await Auth.appleAuth(authorization)
          if (status == 200) {
            Toast.show('Logged in!')
          } else {
            Toast.show('Error loggin in 😭', { type: 'error' })
          }
        } catch (err) {
          console.error('signin err', err)
        }
      }}
    >
      <VStack
        borderRadius={9}
        borderColor="rgba(255,255,255,0.15)"
        borderWidth={2}
        cursor="pointer"
        overflow="hidden"
        hoverStyle={{
          borderColor: 'rgba(255,255,255,0.3)',
        }}
      >
        <HStack paddingRight={20} backgroundColor="#000" alignItems="center">
          <AppleLogoWhite />
          <Text color="#fff" fontSize={18} fontWeight="600" marginTop={-1}>
            {loading ? 'Loading...' : 'Sign in with Apple'}
          </Text>
        </HStack>
      </VStack>
    </VStack>
  )
}
