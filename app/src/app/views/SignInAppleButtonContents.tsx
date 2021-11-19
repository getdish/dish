import { sleep } from '@dish/async'
import { Auth } from '@dish/graph'
import { isSafari } from '@dish/helpers'
import { Text, Toast, XStack, YStack } from '@dish/ui'
import React, { useEffect, useState } from 'react'

import { useIsMountedRef } from '../../helpers/useIsMountedRef'
import { userStore } from '../userStore'
import { AppleLogoWhite } from './AppleLogoWhite'

let auth

export function SignInAppleButtonContents() {
  const [loading, setLoading] = useState(false)
  const isMounted = useIsMountedRef()
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (!hovered) {
      return
    }
    import('../../web/apple-sign-in').then(({ auth: appleAuth }) => {
      auth = appleAuth
      const conf = {
        clientId: 'com.dishapp',
        scope: 'name email',
        redirectURI: Auth.getRedirectUri(),
        usePopup: isSafari,
      }
      auth.init(conf)
    })
  }, [hovered])

  // load after a bit (lighthouse)
  useEffect(() => {
    const tm = setTimeout(() => {
      setHovered(true)
    }, 3000)
    return () => {
      clearTimeout(tm)
    }
  }, [])

  const handleSignIn = async () => {
    setLoading(true)
    setTimeout(() => {
      if (isMounted.current) {
        setLoading(false)
      }
    }, 3000)
    try {
      await sleep(16)
      const res = await auth.signIn()
      if (!res) {
        console.log('no res')
        return // in-browser
      }
      const { authorization } = await res
      const data = await Auth.appleAuth(authorization)
      Toast.show('Logged in!')
      userStore.afterLogin(data)
    } catch (err) {
      Toast.error('Error loggin in 😭')
      console.error('signin err', err)
    }
  }

  return (
    <YStack onHoverIn={() => setHovered(true)} onPress={handleSignIn}>
      <YStack
        borderRadius={9}
        borderColor="rgba(255,255,255,0.3)"
        borderWidth={2}
        cursor="pointer"
        overflow="hidden"
        hoverStyle={{
          borderColor: 'rgba(255,255,255,0.5)',
        }}
      >
        <XStack paddingRight={20} backgroundColor="#000" alignItems="center">
          <AppleLogoWhite />
          <Text
            textAlign="center"
            flex={1}
            color="#fff"
            fontSize={18}
            fontWeight="600"
            marginTop={-1}
            flexShrink={0}
            ellipse
          >
            {loading ? 'Loading...' : 'Sign in with Apple'}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  )
}
