import { Auth } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import { capitalize } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Controller,
  FieldError,
  ValidationRules,
  useForm,
} from 'react-hook-form'
import {
  Form,
  HStack,
  Input,
  InputProps,
  InteractiveContainer,
  Paragraph,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from 'snackui'

import { lightRed } from '../colors'
import { isWeb } from '../constants'
import { useOvermind } from '../state/useOvermind'
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
  const { handleSubmit, errors, control } = useForm()

  useEffect(() => {
    if (isLoggedIn) {
      onDidLogin?.()
    }
  }, [isLoggedIn])

  const onSubmit = useCallback(
    async (e) => {
      console.log('got login')
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
          <VStack>
            <SignInAppleButton />
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

      <Form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="sm" minWidth={260}>
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
              <ValidatedInput
                control={control}
                errors={errors.email}
                name="email"
                spellCheck={false}
                placeholder="Email"
                autoCapitalize="none"
                autoFocus={autofocus}
                onChangeText={(val) => store.setState({ email: val })}
                rules={{
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'invalid email address',
                  },
                }}
              />

              <Spacer size="sm" />

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
              {/* email or username */}
              <ValidatedInput
                control={control}
                errors={errors.email}
                name="email"
                spellCheck={false}
                placeholder="Email or usename"
                autoCapitalize="none"
                autoFocus={autofocus}
                onChangeText={(value) => store.setState({ login: value })}
                rules={{
                  required: true,
                }}
              />
            </>
          )}

          <ValidatedInput
            control={control}
            errors={errors.password}
            secureTextEntry
            name="password"
            placeholder="Password"
            onChangeText={(value) => store.setState({ password: value })}
            rules={{
              required: true,
            }}
          />

          {isWeb && (
            <input
              onSubmit={handleSubmit(onSubmit)}
              type="submit"
              style={{ display: 'none' }}
            />
          )}

          <SmallButton
            accessibilityComponentType="button"
            accessible
            accessibilityRole="button"
            alignSelf="flex-end"
            backgroundColor="#222"
            borderColor="#444"
            color="#fff"
            hoverStyle={{
              backgroundColor: '#333',
            }}
            onPress={handleSubmit(onSubmit)}
          >
            {button_text()}
          </SmallButton>

          {!isRegister && (
            <HStack alignSelf="flex-end">
              <Text fontSize={14}>
                <Link name="forgotPassword">Forgot password?</Link>{' '}
              </Text>
            </HStack>
          )}
        </VStack>
      </Form>

      <Spacer />

      <VStack maxWidth={320}>
        {!!om.state.user.messages.length && (
          <ErrorParagraph>{om.state.user.messages.join(', ')}</ErrorParagraph>
        )}
      </VStack>

      <Spacer size={40} />
    </VStack>
  )
}

const ValidatedInput = ({
  control,
  name,
  defaultValue,
  rules,
  errors,
  ...rest
}: InputProps & {
  control: any
  rules?: ValidationRules
  errors?: FieldError | null
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? ''}
        rules={rules}
        render={({ onChange, onBlur, value }) => {
          return (
            <Input
              {...rest}
              name={name}
              onBlur={onBlur}
              value={value}
              onChangeText={(val) => {
                onChange(val)
                rest?.onChangeText(val)
              }}
            />
          )
        }}
      />
      {errors && <FormError error={errors} />}
    </>
  )
}

const FormError = ({ error }: { error: FieldError | null }) => {
  if (!error) {
    return null
  }

  const name = capitalize(error.ref.name)

  if (error.type === 'required') {
    return <ErrorParagraph>{name} is required.</ErrorParagraph>
  }

  return (
    <Paragraph>
      {name} error: {error.message}
    </Paragraph>
  )
}

const ErrorParagraph = (props) => (
  <Paragraph color="red" fontWeight="500" marginVertical={10} {...props} />
)
