import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Image } from 'react-native'
import { useOvermind } from '../../state/om'
import { Link } from '../shared/Link'
import { Redirect } from '../shared/Redirect'

export const LabAuth = () => {
  const { state, actions } = useOvermind()
  const location = state.router.curPage
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const isLogin = location.path == '/login'

  if (state.auth.is_logged_in) {
    return <Redirect to="/" />
  }

  const or_swap = (
    <View style={styles.login_or}>
      <Text>or switch to</Text>
      <Link name={isLogin ? 'register' : 'login'}>
        {isLogin ? 'Register' : 'Login'}
      </Link>
    </View>
  )

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

  const button = (
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
  )

  const messages = () => {
    if (state.auth.messages.length > 0) {
      const message = state.auth.messages.join('\n')
      return <div className="messages">{message}</div>
    }
  }

  return (
    <View style={styles.login_box}>
      <Image
        style={{ width: '200px', height: '100px' }}
        source={require('../../assets/dish-brandmark-200.png')}
      />
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
      {button}
      {or_swap}
      {messages()}
    </View>
  )
}

const styles = StyleSheet.create({
  login_box: {
    position: 'absolute',
    left: '50%',
    marginLeft: -100,
    top: '50%',
    marginTop: -150,
    width: 200,
    height: 200,
  },

  login_or: {},

  login_messages: {
    paddingTop: '0.5em',
    marginTop: '0.5em',
  },

  auth_menu: {
    position: 'absolute',
    right: 5,
    top: 5,
  },

  text_input: {
    borderWidth: 1,
    borderRadius: 3,
    padding: '1em',
    marginBottom: '0.5em',
  },
})
