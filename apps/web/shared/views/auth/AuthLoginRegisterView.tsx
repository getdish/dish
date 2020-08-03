import { HStack, Text, VStack } from '@dish/ui'
import React, { useEffect, useState } from 'react'

import { Input } from '../../pages/home/Input'
import { useOvermind } from '../../state/om'
import { Link } from '../ui/Link'
import { SmallButton } from '../ui/SmallButton'

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
    <form
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* enter to submit */}
      <input type="submit" style={{ display: 'none' }} />
      {/* <Text style={{ fontSize: 16 }}>
        // some pitch on features for login here
      </Text> */}
      <Input
        name="email"
        placeholder="Login/signup with email"
        value={username}
        onChange={(event) => setUsername(event.target['value'])}
      />

      <Input
        name="password"
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
            <Link name="forgotPassword">Forgot password?</Link>{' '}
          </Text>
        </HStack>
      )}

      {messages()}
    </form>
  )
}
