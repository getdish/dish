import { HStack, SmallTitle, Spacer, Text, VStack } from '@dish/ui'
import { default as React, useEffect, useState } from 'react'

import { lightRed } from '../colors'
import { initAppleSigninButton } from '../helpers/initAppleSigninButton'
import { useOvermind } from '../state/om'
import { Input, InteractiveContainer } from './ui/Input'
import { Link } from './ui/Link'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'
import { SmallButton } from './ui/SmallButton'

const activeStyle: LinkButtonProps = {
  backgroundColor: 'rgba(150,150,150,0.35)',
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
    <VStack alignItems="center" spacing>
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

      <HStack>
        <SmallTitle fontSize={14} divider="center">
          or
        </SmallTitle>
      </HStack>

      <form>
        <VStack spacing height={240}>
          <InteractiveContainer>
            <LinkButton
              flex={1}
              justifyContent="center"
              padding={6}
              color="rgb(150, 150, 150)"
              {...(!isRegister && activeStyle)}
              onPress={() => {
                setIsRegister(false)
              }}
            >
              Login
            </LinkButton>
            <LinkButton
              flex={1}
              justifyContent="center"
              padding={6}
              color="rgb(150, 150, 150)"
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
                onChange={(event) => setEmail(event.target['value'])}
              />
              <Spacer />
              <Input
                name="username"
                value={username}
                placeholder="Username"
                onChange={(event) => setUsername(event.target['value'])}
              />
            </>
          )}

          {!isRegister && (
            <>
              <Input
                name="email"
                value={login}
                placeholder="Email or username"
                onChange={(event) => setLogin(event.target['value'])}
              />
            </>
          )}

          <Input
            name="password"
            secureTextEntry
            onChange={(event) => setPassword(event.target['value'])}
            placeholder="Password"
            value={password}
          />

          <SmallButton
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
                om.actions.user.login({
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
      </form>
    </VStack>
  )
}
