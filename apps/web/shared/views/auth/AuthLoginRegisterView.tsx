import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Image } from 'react-native'
import { useOvermind } from '../../state/om'
import { Link } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'

export const AuthLoginRegisterView = () => {
  const { state, actions } = useOvermind()
  const location = state.router.curPage
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isLogin = location.path == '/login'

  if (state.auth.is_logged_in) {
    console.log('redirecting to home??')
    return null
  }

  const button_text = () => {
    if (state.auth.loading) {
      if (isLogin) {
        return 'Logging in...'
      } else {
        return 'Registering...'
      }
    } else {
      if (isLogin) {
        return 'Login'
      } else {
        return 'Register'
      }
    }
  }

  const messages = () => {
    if (state.auth.messages.length > 0) {
      const message = state.auth.messages.join('\n')
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
              if (isLogin) {
                actions.auth.login({ username: username, password: password })
              } else {
                const result = await actions.auth.register({
                  username: username,
                  password: password,
                })
                if (result) {
                  setUsername('')
                  setPassword('')
                }
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
    borderColor: '#888',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: '0.5em',
  },
})
