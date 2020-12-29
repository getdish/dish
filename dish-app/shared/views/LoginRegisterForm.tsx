import { Store, useStore } from '@dish/use-store'
import { capitalize } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Controller,
  FieldError,
  RegisterOptions,
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

import { isWeb } from '../constants/constants'
import { useRouterCurPage } from '../state/router'
import { useOvermind } from '../state/useOvermind'
import { useUserStore } from '../state/user'
import { SignInAppleButton } from './SignInAppleButton'
import { Link } from './ui/Link'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'
import { SmallButton } from './ui/SmallButton'

const form_page_details = {
  login: {
    submit_text: 'Login',
    submitting_text: 'Loginng in...',
  },
  register: {
    submit_text: 'Register',
    submitting_text: 'Registering...',
  },
  forgotPassword: {
    submit_text: 'Send',
    submitting_text: 'Sending...',
    success_text:
      'If we have your details in our database you will receive an email shortly',
  },
  passwordReset: {
    submit_text: 'Reset',
    submitting_text: 'Resetting...',
    success_text: 'Your password has been reset, you can now login',
  },
}

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
    confirmation: '',
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
  onDidLogin,
  autofocus,
}: {
  onDidLogin?: Function
  autofocus?: boolean
}) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn
  const store = useStore(AuthFormStore)
  const curPageName = useRouterCurPage().name
  let defaultFormPage = Object.keys(form_page_details).includes(curPageName)
    ? curPageName
    : 'login'
  const [formPage, setFormPage] = useState(defaultFormPage)
  const [successText, setSuccessText] = useState('')
  const { handleSubmit, errors, control, watch } = useForm()

  useEffect(() => {
    if (isLoggedIn) {
      onDidLogin?.()
    }
  }, [isLoggedIn])

  const onSubmit = useCallback(
    async (e) => {
      console.log('got login page submission')
      let result
      switch (formPage) {
        case 'register':
          result = await userStore.register(store.state)
          if (result) store.resetState()
          break
        case 'login':
          await userStore.login({
            usernameOrEmail: store.state.login,
            password: store.state.password,
          })
          break
        case 'forgotPassword':
          result = await userStore.forgotPassword(store.state.login)
          if (result) {
            setSuccessText(form_page_details[formPage].success_text)
            setFormPage('success')
          }
          break
        case 'passwordReset':
          result = await userStore.passwordReset({
            password: store.state.password,
            confirmation: store.state.confirmation,
          })
          if (result) {
            setSuccessText(form_page_details[formPage].success_text)
            setFormPage('success')
          }
          break
      }
    },
    [formPage]
  )

  if (isLoggedIn) {
    return null
  }

  const button_text = () => {
    if (userStore.loading) {
      return form_page_details[formPage].submitting_text
    } else {
      return form_page_details[formPage].submit_text
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

      {formPage != 'success' && (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="sm" minWidth={260}>
            <InteractiveContainer height={43} alignSelf="center">
              <LinkButton
                {...navButtonProps}
                {...(formPage == 'login' && activeStyle)}
                onPress={() => setFormPage('login')}
              >
                Login
              </LinkButton>
              <LinkButton
                {...navButtonProps}
                {...(formPage == 'register' && activeStyle)}
                onPress={() => setFormPage('register')}
              >
                Signup
              </LinkButton>
            </InteractiveContainer>

            {formPage == 'register' && (
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

            {formPage == 'forgotPassword' && (
              <Text fontSize={14} width={300}>
                Enter your username or email, if it exists in our database,
                we'll send you an email with a reset link:
              </Text>
            )}

            {(formPage == 'login' || formPage == 'forgotPassword') && (
              <>
                {/* email or username */}
                <ValidatedInput
                  control={control}
                  errors={errors.email}
                  name="email"
                  spellCheck={false}
                  placeholder="Email or username"
                  autoCapitalize="none"
                  autoFocus={autofocus}
                  onChangeText={(value) => store.setState({ login: value })}
                  rules={{
                    required: true,
                  }}
                />
              </>
            )}

            {formPage == 'forgotPassword' && (
              <HStack alignSelf="flex-end">
                <Text fontSize={14}>
                  <Link onClick={(e) => setFormPage('login')}>
                    Back to login
                  </Link>{' '}
                </Text>
              </HStack>
            )}

            {(formPage == 'register' || formPage == 'login') && (
              <>
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
              </>
            )}

            {formPage == 'passwordReset' && (
              <>
                <Text>Enter your new password:</Text>
                <Spacer size="sm" />
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
                <Spacer size="sm" />
                <ValidatedInput
                  control={control}
                  errors={errors.confirmation}
                  secureTextEntry
                  name="confirmation"
                  placeholder="Confirmation"
                  onChangeText={(value) =>
                    store.setState({ confirmation: value })
                  }
                  rules={{
                    required: true,
                    validate: (value) => {
                      return (
                        value == watch('password') || "Passwords don't match"
                      )
                    },
                  }}
                />
              </>
            )}

            {isWeb && (
              <input
                onSubmit={handleSubmit(onSubmit)}
                type="submit"
                style={{ visibility: 'hidden', height: 0 }}
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

            {formPage == 'login' && (
              <HStack alignSelf="flex-end">
                <Text fontSize={14}>
                  <Link onClick={(e) => setFormPage('forgotPassword')}>
                    Forgot password?
                  </Link>{' '}
                </Text>
              </HStack>
            )}
          </VStack>
        </Form>
      )}

      {formPage == 'success' && (
        <Text fontSize={14} width={300}>
          {successText}
        </Text>
      )}

      <Spacer />

      <VStack maxWidth={320}>
        {!!userStore.messages.length && (
          <ErrorParagraph>{userStore.messages.join(', ')}</ErrorParagraph>
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
  rules?: RegisterOptions
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
