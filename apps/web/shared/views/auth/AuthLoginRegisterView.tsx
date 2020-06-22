import { HStack, Text, VStack } from '@dish/ui'
import React, { useEffect, useState } from 'react'
import { Button, TextInput, View } from 'react-native'

import { useOvermind } from '../../state/useOvermind'
import { SmallButton } from '../home/SmallButton'
import { Link } from '../ui/Link'
import { textStyles } from './textStyles'

export const AuthLoginRegisterView = (props: { setMenuOpen: Function }) => {
  const om = useOvermind()
  const pageName = om.state.router.curPage.name
  const location = om.state.router.curPage
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isRegister = location.path == '/register'
  const isLoggedIn = om.state.user.isLoggedIn

  useEffect(() => {
    // open menu on nav to login/register
    if (pageName == 'login' || pageName == 'register') {
      props.setMenuOpen(true)
    }
  }, [pageName])

  useEffect(() => {
    // close menu on login/logout
    if (isLoggedIn) {
      props.setMenuOpen(false)
    }
  }, [isLoggedIn])

  if (isLoggedIn) {
    return null
  }

  const button_text = () => {
    if (om.state.user.loading) {
      if (isRegister) {
        return 'Registering...'
      } else {
        return 'Logging in...'
      }
    } else {
      if (isRegister) {
        return 'Register'
      } else {
        return 'Login'
      }
    }
  }

  const messages = () => {
    if (om.state.user.messages.length > 0) {
      const message = om.state.user.messages.join('\n')
      return <div className="messages">{message}</div>
    }
  }

  return (
    <View style={textStyles.login_box}>
      {/* <Text style={{ fontSize: 16 }}>
        // some pitch on features for login here
      </Text> */}
      <TextInput
        // @ts-ignore
        name="email"
        style={textStyles.textField}
        placeholder="Login/signup with email"
        value={username}
        onChange={(event) => setUsername(event.target['value'])}
      />

      <TextInput
        // @ts-ignore
        name="password"
        style={textStyles.textField}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChange={(event) => setPassword(event.target['value'])}
      />

      <HStack width="100%">
        <VStack flex={1} />
        <SmallButton
          onPress={async () => {
            if (isRegister) {
              const result = await om.actions.user.register({
                username: username,
                password: password,
              })
              if (result) {
                setUsername('')
                setPassword('')
              }
            } else {
              om.actions.user.login({
                username: username,
                password: password,
              })
            }
          }}
        >
          {button_text()}
        </SmallButton>
      </HStack>

      {username.length > 3 && (
        <HStack>
          <Text fontSize={16}>
            <Link inline name="forgotPassword">
              Forgot password?
            </Link>{' '}
          </Text>
        </HStack>
      )}

      {messages()}
    </View>
  )
}
