import {
  Divider,
  Form,
  HStack,
  Input,
  InteractiveContainer,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import { default as React, useEffect, useState } from 'react'

import { lightRed } from '../colors'
import { isWeb } from '../constants'
import { initAppleSigninButton } from '../helpers/initAppleSigninButton'
import { useOvermind } from '../state/om'
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

export const LoginRegisterForm = ({
  showForm,
  onDidLogin,
}: {
  showForm?: 'login' | 'register'
  onDidLogin?: Function
}) => {
  const om = useOvermind()
  const isLoggedIn = om.state.user.isLoggedIn
  const [isRegister, setIsRegister] = useState(showForm !== 'login')
  const [login, setLogin] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    initAppleSigninButton()

    if (isLoggedIn) {
      onDidLogin?.()
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
          <VStack
            borderRadius={9}
            borderColor="rgba(255,255,255,0.15)"
            borderWidth={2}
            hoverStyle={{
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <div
              id="appleid-signin"
              className="signin-button"
              data-color="black"
              data-border="true"
              data-type="sign in"
            ></div>
          </VStack>
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

      <Form>
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
                value={email}
                placeholder="Email"
                autoCapitalize="none"
                onChangeText={(val) => setEmail(val)}
              />
              <Spacer />
              <Input
                name="username"
                autoCapitalize="none"
                value={username}
                placeholder="Username"
                onChangeText={(val) => setUsername(val)}
              />
            </>
          )}

          {!isRegister && (
            <>
              <Input
                name="email"
                autoCapitalize="none"
                value={login}
                placeholder="Email or username"
                onChangeText={(value) => setLogin(value)}
              />
            </>
          )}

          <Input
            name="password"
            secureTextEntry
            onChangeText={(val) => setPassword(val)}
            placeholder="Password"
            value={password}
          />

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
            onPress={async () => {
              if (isRegister) {
                const result = await om.actions.user.register({
                  username,
                  email,
                  password,
                })
                if (result) {
                  setUsername('')
                  setPassword('')
                }
              } else {
                await om.actions.user.login({
                  usernameOrEmail: login,
                  password: password,
                })
              }
            }}
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
