import { capitalize } from 'lodash'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'
import { Controller, FieldError, RegisterOptions, useForm } from 'react-hook-form'
import {
  Button,
  Form,
  HStack,
  Input,
  InputProps,
  InteractiveContainer,
  Paragraph,
  Spacer,
  Text,
  Title,
  VStack,
} from 'snackui'

import { isWeb } from '../constants/constants'
import { useQueryLoud } from '../helpers/useQueryLoud'
import { router, useRouterCurPage } from '../router'
import { useUserStore, userStore } from './userStore'
import { Link } from './views/Link'
import { LinkButtonProps } from './views/LinkProps'
import { SignInAppleButton } from './views/SignInAppleButton'
import { SmallTitle } from './views/SmallTitle'

type AuthFormProps = {
  autoFocus?: boolean
  setFormPage: Function
}

const pages = ['login', 'register', 'forgotPassword', 'passwordReset']

export const AuthForm = memo(
  ({ onDidLogin, autoFocus }: { onDidLogin?: Function; autoFocus?: boolean }) => {
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn
    const curPageName = useRouterCurPage().name
    const [formPage, setFormPage] = useState(pages.find((x) => x === curPageName) ?? 'login')

    useEffect(() => {
      if (isLoggedIn) {
        onDidLogin?.()
      }
    }, [isLoggedIn])

    if (isLoggedIn) {
      return null
    }

    const activeStyle: LinkButtonProps = {
      backgroundColor: 'rgba(150,150,150,0.35)',
    }

    function getContent() {
      if (formPage === 'login') {
        return <LoginForm autoFocus={autoFocus} setFormPage={setFormPage} />
      }
      if (formPage === 'signup') {
        return <SignupForm autoFocus={autoFocus} setFormPage={setFormPage} />
      }
      if (formPage === 'forgotPassword') {
        return <ForgotPassword setFormPage={setFormPage} />
      }
      if (formPage === 'passwordReset') {
        return <PasswordReset setFormPage={setFormPage} />
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
            <HStack width="100%" alignItems="center">
              <VStack height={1} flex={1} backgroundColor="rgba(255,255,255,0.1)" />
              <SmallTitle fontSize={14} divider="center">
                or
              </SmallTitle>
              <VStack height={1} flex={1} backgroundColor="rgba(255,255,255,0.1)" />
            </HStack>
          </>
        )}

        <InteractiveContainer height={40} alignSelf="center">
          <Button
            borderRadius={0}
            {...(formPage == 'login' && activeStyle)}
            onPress={() => setFormPage('login')}
          >
            Login
          </Button>
          <Button
            borderRadius={0}
            {...(formPage == 'signup' && activeStyle)}
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

const PasswordReset = ({ autoFocus }: AuthFormProps) => {
  const { onChange, onSubmit, isSubmitting, control, errors, watch, isSuccess } = useFormAction({
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
    >
      <VStack alignItems="center">
        <Title>Reset Password</Title>
        <Text>Enter your new password:</Text>
      </VStack>
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
        name="confirmation"
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

const ForgotPassword = ({ autoFocus, setFormPage }: AuthFormProps) => {
  const { onChange, onSubmit, control, errors, isSuccess, isSubmitting } = useFormAction({
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
      after={
        <HStack alignSelf="flex-end">
          <Text fontSize={14}>
            <Link onClick={(e) => setFormPage('login')}>Back to login</Link>{' '}
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

const LoginForm = ({ autoFocus, setFormPage }: AuthFormProps) => {
  const { onChange, onSubmit, control, errors, isSuccess, isSubmitting } = useFormAction({
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
      after={
        <Link alignSelf="flex-end" fontSize={14} onClick={(e) => setFormPage('forgotPassword')}>
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
      />
    </SubmittableForm>
  )
}

const SignupForm = ({ autoFocus }: AuthFormProps) => {
  const { onChange, onSubmit, control, errors, isSubmitting } = useFormAction({
    name: 'register',
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    submit: userStore.register,
  })
  return (
    <SubmittableForm isSubmitting={isSubmitting} onSubmit={onSubmit} submitText="Signup">
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
        rules={{
          min: 7,
          required: true,
        }}
      />
    </SubmittableForm>
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
        name={name ?? ''}
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
                rest?.onChangeText?.(val)
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

  const name = capitalize(error.ref?.name)

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

function SubmittableForm({
  onSubmit,
  submitText = 'Go',
  successText = 'Submit',
  isSuccess,
  errorText,
  children,
  isSubmitting,
  after,
}: {
  onSubmit: any
  isSubmitting: boolean
  submitText?: string
  isSuccess?: boolean
  successText?: string
  errorText?: string
  children?: any
  after?: any
}) {
  return (
    <Form
      onSubmit={onSubmit}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSubmit()
        }
      }}
    >
      <VStack spacing="sm" minWidth={260}>
        {!isSuccess && (
          <Suspense fallback={null}>
            <VStack spacing="sm">{children}</VStack>
          </Suspense>
        )}

        {!isSuccess && (
          <Button
            // accessibilityComponentType="button"
            accessible
            accessibilityRole="button"
            alignSelf="flex-end"
            onPress={onSubmit}
            theme="active"
            disabled={isSubmitting}
          >
            {submitText}
            {isSubmitting ? '...' : ''}
          </Button>
        )}

        {isSuccess && (
          <Text fontSize={14} width={300}>
            {successText}
          </Text>
        )}

        {!!errorText && <ErrorParagraph>{errorText}</ErrorParagraph>}

        {after}
      </VStack>
    </Form>
  )
}

function useFormAction<Values extends { [key: string]: any }>({
  name,
  initialValues,
  submit,
}: {
  name: string
  initialValues: Values
  submit: (n: Values) => Promise<any>
}) {
  const { handleSubmit, errors, control, watch } = useForm()
  const data = useRef(initialValues)
  const [send, setSend] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const response = useQueryLoud([name, send], () => submit(data.current), {
    enabled: !!send,
    suspense: false,
    retry: false,
  })
  const onSubmit = handleSubmit(() => {
    setIsSubmitting(true)
    setSend(Math.random())
  })

  useEffect(() => {
    if (response.isError || response.data?.error) {
      setIsSubmitting(false)
    }
  }, [response.data, response.isError])

  const onChange = (key: keyof Values) => (val: string) => {
    // @ts-expect-error
    data.current[key] = val
  }

  if (response.isSuccess) {
    console.log('🤠 NICE JOB', send, name, data, response)
  } else {
    // console.log('response', response)
  }

  return {
    errors,
    isSubmitting,
    control,
    response,
    isSuccess: response.isSuccess && response.data && !response.data.error,
    onChange,
    onSubmit,
    watch,
  }
}
