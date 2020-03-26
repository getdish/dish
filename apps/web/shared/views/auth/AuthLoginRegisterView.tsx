import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Image } from 'react-native'
import { useOvermind } from '../../state/om'
import { Link } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'

export const AuthLoginRegisterView = (props: { setMenuOpen: Function }) => {
  const om = useOvermind()
  const pageName = om.state.router.curPage.name
  const location = om.state.router.curPage
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isRegister = location.path == '/register'
  const isLoggedIn = om.state.auth.is_logged_in

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
    if (om.state.auth.loading) {
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
    if (om.state.auth.messages.length > 0) {
      const message = om.state.auth.messages.join('\n')
      return <div className="messages">{message}</div>
    }
  }

  return (
    <View style={styles.login_box}>
      {/* <Text style={{ fontSize: 16 }}>
        // some pitch on features for login here
      </Text> */}
      <TextInput
        style={styles.text_input}
        placeholder="Login or register with email"
        value={username}
        onChange={(event) => setUsername(event.target['value'])}
      />

      {username.length > 3 && (
        <TextInput
          style={styles.text_input}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChange={(event) => setPassword(event.target['value'])}
        />
      )}

      {username.length > 3 && (
        <HStack width="100%">
          <VStack flex={1} />
          <Button
            onPress={async () => {
              if (isRegister) {
                const result = await om.actions.auth.register({
                  username: username,
                  password: password,
                })
                if (result) {
                  setUsername('')
                  setPassword('')
                }
              } else {
                om.actions.auth.login({
                  username: username,
                  password: password,
                })
              }
            }}
            title={button_text()}
          ></Button>
        </HStack>
      )}

      {username.length > 3 && (
        <HStack>
          <Text style={{ fontSize: 16 }}>
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

const styles = StyleSheet.create({
  login_box: {},

  login_messages: {
    paddingTop: '0.5em',
    marginTop: '0.5em',
  },

  text_input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: '0.5em',
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowRadius: 3,
  },
})
