import { Auth } from '@dish/graph'
import React, { memo, useEffect, useState } from 'react'
import {
  Button,
  HStack,
  InteractiveContainer,
  Paragraph,
  Spacer,
  Text,
  Title,
  VStack,
} from 'snackui'

import { isWeb } from '../constants/constants'
import { router, useRouterCurPage } from '../router'
import { useFormAction } from './hooks/useFormAction'
import { useUserStore, userStore } from './userStore'
import { ErrorParagraph, SubmittableForm, ValidatedInput } from './views/Form'
import { Link } from './views/Link'
import { SignInAppleButton } from './views/SignInAppleButton'
import { SmallTitle } from './views/SmallTitle'

type AuthFormPageProps = {
  autoFocus?: boolean
  setFormPage?: Function
}

const pages = ['login', 'register', 'forgotPassword', 'passwordReset'] as const

export const AuthForm = memo(
  ({
    onDidLogin,
    formPage: propFormPage,
    ...rest
  }: {
    onDidLogin?: Function
    autoFocus?: boolean
    formPage?: string
  }) => {
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn
    const curPageName = useRouterCurPage().name
    const curPageFromRoute = pages.find((x) => x === curPageName)
    const initFormPage =
      propFormPage ?? curPageFromRoute ?? (Auth.hasEverLoggedIn ? 'login' : 'signup')
    const [formPage, setFormPage] = useState(initFormPage)

    useEffect(() => {
      if (isLoggedIn) {
        onDidLogin?.()
      }
    }, [isLoggedIn])

    if (isLoggedIn) {
      return null
    }

    function getContent() {
      if (formPage === 'login') {
        return <LoginForm {...rest} setFormPage={setFormPage} />
      }
      if (formPage === 'signup') {
        return <SignupForm {...rest} setFormPage={setFormPage} />
      }
      if (formPage === 'forgotPassword') {
        return <ForgotPassword {...rest} setFormPage={setFormPage} />
      }
      if (formPage === 'passwordReset') {
        return <PasswordReset {...rest} setFormPage={setFormPage} />
      }
    }

    return (
      <VStack alignItems="center" spacing="sm">
        {isWeb && (
          <>
            <VStack>
              <SignInAppleButton />
            </VStack>
            <Spacer />
            <SmallTitle fontSize={14} divider="center">
              or
            </SmallTitle>
          </>
        )}

        <InteractiveContainer alignSelf="center">
          <Button
            borderRadius={0}
            textProps={{
              fontSize: 12,
              fontWeight: formPage == 'login' ? '800' : '500',
              opacity: formPage === 'login' ? 1 : 0.5,
            }}
            active={formPage == 'login'}
            onPress={() => setFormPage('login')}
          >
            Login
          </Button>
          <Button
            borderRadius={0}
            textProps={{
              fontSize: 12,
              fontWeight: formPage == 'signup' ? '800' : '500',
              opacity: formPage === 'signup' ? 1 : 0.5,
            }}
            active={formPage == 'signup'}
            onPress={() => setFormPage('signup')}
          >
            Signup
          </Button>
        </InteractiveContainer>

        {getContent()}

        <VStack maxWidth={320}>
          {!!userStore.messages.length && (
            <ErrorParagraph>{userStore.messages.join(', ')}</ErrorParagraph>
          )}
        </VStack>

        <Spacer />
      </VStack>
    )
  }
)

export const PasswordReset = ({ autoFocus }: AuthFormPageProps) => {
  const { onChange, onSubmit, isSubmitting, control, errors, watch, isSuccess, errorMessage } =
    useFormAction({
      name: 'passwordReset',
      initialValues: {
        password: '',
        confirmation: '',
      },
      submit: (obj) =>
        userStore.fetch('POST', '/api/user/passwordReset', {
          ...obj,
          token: router.curPage.params.token,
        }),
    })
  return (
    <SubmittableForm
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      isSuccess={isSuccess}
      successText="Your password has been reset, you can now login"
      errorText={errorMessage}
    >
      <Title>Reset Password</Title>
      <Paragraph opacity={0.5}>Enter your new password:</Paragraph>
      <ValidatedInput
        control={control}
        autoFocus={autoFocus}
        errors={errors.password}
        secureTextEntry
        name="password"
        placeholder="Password"
        onChangeText={onChange('password')}
        rules={{
          required: true,
        }}
      />
      <ValidatedInput
        control={control}
        errors={errors.confirmation}
        secureTextEntry
        // @ts-ignore
        name="password-confirm"
        placeholder="Confirmation"
        onChangeText={onChange('confirmation')}
        rules={{
          required: true,
          validate: (value) => {
            return value == watch('password') || "Passwords don't match"
          },
        }}
      />
    </SubmittableForm>
  )
}

export const ForgotPassword = ({ autoFocus, setFormPage }: AuthFormPageProps) => {
  const { onChange, onSubmit, control, errors, isSuccess, isSubmitting, errorMessage } =
    useFormAction({
      name: 'forgotPassword',
      initialValues: {
        login: '',
      },
      submit: (obj) => userStore.fetch('POST', '/api/user/forgotPassword', obj),
    })
  return (
    <SubmittableForm
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      successText="If we have your details in our database you will receive an email shortly"
      submitText="Go"
      isSuccess={isSuccess}
      errorText={errorMessage}
      after={
        <HStack alignSelf="flex-end">
          <Text fontSize={14}>
            <Link onClick={() => setFormPage?.('login')}>Back to login</Link>{' '}
          </Text>
        </HStack>
      }
    >
      <Paragraph maxWidth={280} paddingVertical={15}>
        Enter username or email, we'll send you an email with a reset link if account exists:
      </Paragraph>
      <ValidatedInput
        control={control}
        errors={errors.email}
        name="email"
        spellCheck={false}
        placeholder="Email or username"
        autoCapitalize="none"
        autoFocus={autoFocus}
        onChangeText={onChange('login')}
        rules={{
          required: true,
        }}
      />
    </SubmittableForm>
  )
}

export const LoginForm = ({ autoFocus, setFormPage }: AuthFormPageProps) => {
  const { onChange, onSubmit, control, errors, isSuccess, isSubmitting, errorMessage } =
    useFormAction({
      name: 'login',
      initialValues: {
        login: '',
        password: '',
      },
      submit: userStore.login,
    })
  return (
    <SubmittableForm
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      isSuccess={isSuccess}
      submitText="Go"
      errorText={errorMessage}
      after={
        <Link alignSelf="flex-end" fontSize={14} onClick={(e) => setFormPage?.('forgotPassword')}>
          Forgot password?
        </Link>
      }
    >
      <ValidatedInput
        control={control}
        errors={errors.email}
        name="email"
        spellCheck={false}
        placeholder="Email or username"
        autoCapitalize="none"
        autoFocus={autoFocus}
        onChangeText={onChange('login')}
        rules={{
          required: true,
        }}
      />
      <ValidatedInput
        control={control}
        errors={errors.password}
        secureTextEntry
        name="password"
        placeholder="Password"
        onChangeText={onChange('password')}
        rules={{
          required: true,
        }}
        onSubmitEditing={onSubmit}
      />
    </SubmittableForm>
  )
}

export const SignupForm = ({ autoFocus }: AuthFormPageProps) => {
  const { onChange, onSubmit, control, errors, isSubmitting, errorMessage } = useFormAction({
    name: 'register',
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    submit: userStore.register,
  })

  return (
    <SubmittableForm
      errorText={errorMessage}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      submitText="Signup"
    >
      <ValidatedInput
        control={control}
        errors={errors.email}
        name="email"
        spellCheck={false}
        placeholder="Email"
        autoCapitalize="none"
        autoFocus={autoFocus}
        onChangeText={onChange('email')}
        rules={{
          required: true,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'invalid email address',
          },
        }}
      />
      <ValidatedInput
        name="username"
        control={control}
        errors={errors.username}
        spellCheck={false}
        autoCapitalize="none"
        placeholder="Username"
        onChangeText={onChange('username')}
        rules={{
          required: true,
          min: 3,
          pattern: {
            value: /^[a-z0-9]{1}[a-z0-9\-\_]+$/i,
            message: 'must be a-z, 0-9, "_" or "-" only',
          },
        }}
      />
      <ValidatedInput
        control={control}
        errors={errors.password}
        secureTextEntry
        name="password"
        placeholder="Password"
        onChangeText={onChange('password')}
        onSubmitEditing={onSubmit}
        rules={{
          min: 7,
          required: true,
        }}
      />
    </SubmittableForm>
  )
}
