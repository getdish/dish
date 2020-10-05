import { Auth } from '@dish/graph'
import {
  Form,
  HStack,
  Input,
  InteractiveContainer,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import { default as React, useCallback, useEffect, useState } from 'react'

import { lightRed } from '../colors'
import { isWeb } from '../constants'
import { useOvermind } from '../state/om'
import { SignInAppleButton } from './SignInAppleButton'
import { Link } from './ui/Link'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'
import { SmallButton } from './ui/SmallButton'

const activeStyle: LinkButtonProps = {
  backgroundColor: 'rgba(150,150,150,0.35)',
}

const navButtonProps: LinkButtonProps = {
  flex: 1,
  justifyContent: 'center',
  paddingVertical: 6,
  paddingHorizontal: 12,
  height: 41,
  alignItems: 'center',
  color: 'rgb(120, 120, 120)',
}

class AuthFormStore extends Store {
  static defaultState = {
    login: '',
    username: '',
    email: '',
    password: '',
  }

  state = AuthFormStore.defaultState

  setState(state: Partial<AuthFormStore['state']>) {
    this.state = { ...this.state, ...state }
  }

  resetState() {
    this.state = AuthFormStore.defaultState
  }
}

export const LoginRegisterForm = ({
  showForm,
  onDidLogin,
  autofocus,
}: {
  showForm?: 'login' | 'register'
  onDidLogin?: Function
  autofocus?: boolean
}) => {
  const om = useOvermind()
  const isLoggedIn = om.state.user.isLoggedIn
  const store = useStore(AuthFormStore)
  const [isRegister, setIsRegister] = useState(
    showForm ? showForm !== 'login' : Auth.hasEverLoggedIn ? false : true
  )

  useEffect(() => {
    if (isLoggedIn) {
      onDidLogin?.()
    }
  }, [isLoggedIn])

  const handleSubmit = useCallback(
    async (e) => {
      console.log('got login')
      e.preventDefault()
      if (isRegister) {
        const result = await om.actions.user.register(store.state)
        if (result) {
          store.resetState()
        }
      } else {
        await om.actions.user.login({
          usernameOrEmail: store.state.login,
          password: store.state.password,
        })
      }
    },
    [isRegister]
  )

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
        return 'Go'
      } else {
        return 'Login'
      }
    }
  }

  return (
    <VStack alignItems="center">
      {isWeb && (
        <>
          <SignInAppleButton />
          <Spacer />
          <HStack width="100%" alignItems="center">
            <VStack
              height={1}
              flex={1}
              backgroundColor="rgba(255,255,255,0.1)"
            />
            <SmallTitle fontSize={14} divider="center">
              or
            </SmallTitle>
            <VStack
              height={1}
              flex={1}
              backgroundColor="rgba(255,255,255,0.1)"
            />
          </HStack>
          <Spacer />
        </>
      )}

      <Form onSubmit={handleSubmit}>
        <VStack spacing height={250} minWidth={260}>
          <InteractiveContainer height={43} alignSelf="center">
            <LinkButton
              {...navButtonProps}
              {...(!isRegister && activeStyle)}
              onPress={() => {
                setIsRegister(false)
              }}
            >
              Login
            </LinkButton>
            <LinkButton
              {...navButtonProps}
              {...(isRegister && activeStyle)}
              onPress={() => {
                setIsRegister(true)
              }}
            >
              Signup
            </LinkButton>
          </InteractiveContainer>

          {isRegister && (
            <>
              <Input
                name="email"
                spellCheck={false}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(val) => store.setState({ email: val })}
                autoFocus={autofocus}
              />
              <Spacer />
              <Input
                name="username"
                spellCheck={false}
                autoCapitalize="none"
                placeholder="Username"
                onChangeText={(val) => store.setState({ username: val })}
              />
            </>
          )}

          {!isRegister && (
            <>
              <Input
                name="email"
                spellCheck={false}
                autoCapitalize="none"
                placeholder="Email or username"
                onChangeText={(value) => store.setState({ login: value })}
              />
            </>
          )}

          <Input
            name="password"
            secureTextEntry
            onChangeText={(val) => store.setState({ password: val })}
            placeholder="Password"
          />

          {isWeb && <input type="submit" style={{ display: 'none' }} />}

          <SmallButton
            accessibilityComponentType="button"
            accessible
            accessibilityRole="button"
            alignSelf="flex-end"
            backgroundColor="#222"
            borderColor="#444"
            textStyle={{
              color: '#fff',
            }}
            hoverStyle={{
              backgroundColor: '#333',
            }}
            onPress={handleSubmit}
          >
            {button_text()}
          </SmallButton>

          {!!om.state.user.messages.length && (
            <Text color={lightRed}>{om.state.user.messages.join(', ')}</Text>
          )}

          {!isRegister && (
            <HStack alignSelf="flex-end">
              <Text fontSize={16}>
                <Link name="forgotPassword">Forgot password?</Link>{' '}
              </Text>
            </HStack>
          )}
        </VStack>
      </Form>
    </VStack>
  )
}
