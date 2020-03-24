import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Image } from 'react-native'
import { useOvermind } from '../../state/om'
import { Link } from '../shared/Link'
import { Redirect } from '../shared/Redirect'
import { HStack } from '../shared/Stacks'

export const LabAuth = () => {
  const { state, actions } = useOvermind()
  const location = state.router.curPage
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isLogin = location.path == '/login'

  if (state.auth.is_logged_in) {
    return <Redirect to="/" />
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
      <TextInput
        style={styles.text_input}
        placeholder="username"
        value={username}
        onChange={(event) => setUsername(event.target['value'])}
      />
      <TextInput
        style={styles.text_input}
        placeholder="password"
        value={password}
        secureTextEntry={true}
        onChange={(event) => setPassword(event.target['value'])}
      />
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
      <HStack>
        <Text style={{ fontSize: 16 }}>
          or switch to{' '}
          <Link inline name={isLogin ? 'register' : 'login'}>
            {isLogin ? 'register' : 'login'}
          </Link>{' '}
        </Text>
      </HStack>
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
