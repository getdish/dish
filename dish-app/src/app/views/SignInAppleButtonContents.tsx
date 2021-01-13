import { sleep } from '@dish/async'
import { Auth } from '@dish/graph'
import { isSafari } from '@dish/helpers'
import React, { useEffect, useState } from 'react'
import { HStack, Text, Toast, VStack } from 'snackui'

import { useIsMountedRef } from '../../helpers/useIsMountedRef'
import { userStore } from '../userStore'
import { AppleLogoWhite } from './AppleLogoWhite'

const { auth } = require('../../web/apple-sign-in')

export default function SignInAppleButton() {
  useEffect(() => {
    auth.init({
      clientId: 'com.dishapp',
      scope: 'name email',
      redirectURI: Auth.getRedirectUri(),
      usePopup: isSafari,
    })
  }, [])

  const [loading, setLoading] = useState(false)
  const isMounted = useIsMountedRef()

  const handleSignIn = async () => {
    setLoading(true)
    setTimeout(() => {
      if (isMounted.current) {
        setLoading(false)
      }
    }, 3000)
    await sleep(40)
    try {
      const res = await auth.signIn()
      if (!res) {
        console.log('no res')
        return // in-browser
      }
      const { authorization } = await res
      const user = await Auth.appleAuth(authorization)
      Toast.show('Logged in!')
      userStore.setUser(user)
    } catch (err) {
      Toast.show('Error loggin in 😭', { type: 'error' })
      console.error('signin err', err)
    }
  }

  return (
    <VStack onPress={handleSignIn}>
      <VStack
        borderRadius={9}
        borderColor="rgba(255,255,255,0.3)"
        borderWidth={2}
        cursor="pointer"
        overflow="hidden"
        hoverStyle={{
          borderColor: 'rgba(255,255,255,0.5)',
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
