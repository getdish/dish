import React, { useState } from 'react'

// import { Button, Input, Image, Form } from '@o/ui'
import { useOvermind } from '../overmind'
import logo from '../assets/dish-brandmark-200.png'

export const LabAuth = () => {
  const { state, actions } = useOvermind()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const or_swap = (
    <div className="or_swap">
      or{' '}
      {isLogin ? (
        <a
          onClick={() => {
            setIsLogin(false)
          }}
        >
          register
        </a>
      ) : (
        <a
          onClick={() => {
            setIsLogin(true)
          }}
        >
          login
        </a>
      )}
    </div>
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
    <button
      type="submit"
      onClick={async () => {
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
            setIsLogin(true)
          }
        }
      }}
    >
      {button_text()}
    </button>
  )

  const messages = () => {
    if (state.auth.messages.length > 0) {
      const message = state.auth.messages.join('\n')
      return <div className="messages">{message}</div>
    }
  }
  return (
    <div className="login-box">
      <img alt="" src={logo} />
      <form>
        <input
          id="username"
          placeholder="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
        />
        <input
          id="password"
          value={password}
          placeholder="password"
          type="password"
          onChange={event => setPassword(event.target.value)}
        />
        {button}
        {or_swap}
      </form>
      {messages()}
    </div>
  )
}
