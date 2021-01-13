import { userFetch } from '@dish/graph'
import { Store, useStore } from '@dish/use-store'
import { capitalize } from 'lodash'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Controller,
  FieldError,
  RegisterOptions,
  useForm,
} from 'react-hook-form'
import { useQuery } from 'react-query'
import {
  Button,
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
import { useQueryLoud } from '../helpers/useQueryLoud'
import { useRouterCurPage } from '../router'
import { useUserStore, userStore } from './userStore'
import { Link } from './views/Link'
import { LinkButtonProps } from './views/LinkProps'
import { SignInAppleButton } from './views/SignInAppleButton'

type AuthFormProps = {
  autoFocus?: boolean
  setFormPage: Function
}

const form_page_details = {
  login: {
    submit_text: 'Login',
    submitting_text: 'Signing in...',
  },
  register: {
    submit_text: 'Sign up',
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

export const AuthForm = ({
  onDidLogin,
  autoFocus,
}: {
  onDidLogin?: Function
  autoFocus?: boolean
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

  if (isLoggedIn) {
    return null
  }

  const contents = (() => {
    if (formPage === 'login') {
      return <LoginForm autoFocus={autoFocus} setFormPage={setFormPage} />
    }
    if (formPage === 'signup') {
      return <SignupForm autoFocus={autoFocus} setFormPage={setFormPage} />
    }
    if (formPage === 'forgotPassword') {
      return <ForgotPassword setFormPage={setFormPage} />
    }
  })()

  const onSubmit = async (e) => {
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

      <Spacer />

      {contents}

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

// {formPage != 'success' && (
//   <Form onSubmit={handleSubmit(onSubmit)}>
//     <VStack spacing="sm" minWidth={260}>
//       {formPage == 'register' && (
//         <>

//         </>
//       )}

//       {formPage == 'passwordReset' && (
//         <>
//           <Text>Enter your new password:</Text>
//           <Spacer size="sm" />
//           <ValidatedInput
//             control={control}
//             errors={errors.password}
//             secureTextEntry
//             name="password"
//             placeholder="Password"
//             onChangeText={(value) => store.setState({ password: value })}
//             rules={{
//               required: true,
//             }}
//           />
//           <Spacer size="sm" />
//           <ValidatedInput
//             control={control}
//             errors={errors.confirmation}
//             secureTextEntry
//             name="confirmation"
//             placeholder="Confirmation"
//             onChangeText={(value) =>
//               store.setState({ confirmation: value })
//             }
//             rules={{
//               required: true,
//               validate: (value) => {
//                 return (
//                   value == watch('password') || "Passwords don't match"
//                 )
//               },
//             }}
//           />
//         </>
//       )}

//       {isWeb && (
//         <input
//           onSubmit={handleSubmit(onSubmit)}
//           type="submit"
//           style={{ visibility: 'hidden', height: 0 }}
//         />
//       )}

//       <Button
//         accessibilityComponentType="button"
//         accessible
//         accessibilityRole="button"
//         alignSelf="flex-end"
//         onPress={handleSubmit(onSubmit)}
//       >
//         {button_text()}
//       </Button>

//       {formPage == 'login' && (
//         <HStack alignSelf="flex-end">
//           <Text fontSize={14}>
//             <Link onClick={(e) => setFormPage('forgotPassword')}>
//               Forgot password?
//             </Link>{' '}
//           </Text>
//         </HStack>
//       )}
//     </VStack>
//   </Form>
// )}

function SubmittableForm({
  onSubmit,
  submitText,
  successText,
  errorText,
  children,
  after,
}: {
  onSubmit: any
  submitText: string
  successText?: string
  errorText?: string
  children?: any
  after?: any
}) {
  return (
    <Form onSubmit={onSubmit}>
      <VStack spacing="sm" minWidth={260}>
        {children}

        {isWeb && (
          <input
            onSubmit={onSubmit}
            type="submit"
            style={{ visibility: 'hidden', height: 0 }}
          />
        )}

        <Button
          accessibilityComponentType="button"
          accessible
          accessibilityRole="button"
          alignSelf="flex-end"
          onPress={onSubmit}
          theme="active"
        >
          {submitText}
        </Button>

        {!!successText && (
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

const ForgotPassword = ({ autoFocus, setFormPage }: AuthFormProps) => {
  return (
    <SubmittableForm
      after={
        <HStack alignSelf="flex-end">
          <Text fontSize={14}>
            <Link onClick={(e) => setFormPage('login')}>Back to login</Link>{' '}
          </Text>
        </HStack>
      }
    >
      <Text fontSize={14} width={300}>
        Enter your username or email, if it exists in our database, we'll send
        you an email with a reset link:
      </Text>

      <ValidatedInput
        control={control}
        errors={errors.email}
        name="email"
        spellCheck={false}
        placeholder="Email or username"
        autoCapitalize="none"
        autoFocus={autoFocus}
        onChangeText={(value) => store.setState({ login: value })}
        rules={{
          required: true,
        }}
      />
    </SubmittableForm>
  )
}

const LoginForm = ({ autoFocus, setFormPage }: AuthFormProps) => {
  const { onChange, onSubmit, control, errors } = useFormAction({
    name: 'register',
    initialValues: {
      login: '',
      password: '',
    },
    submit: (obj) =>
      userFetch('POST', '/api/user/login', obj).then((res) => {
        if (res.success) {
          userStore.setUser(res.user)
        }
        return res
      }),
  })

  return (
    <SubmittableForm
      onSubmit={onSubmit}
      submitText="Login"
      after={
        <HStack alignSelf="flex-end">
          <Text fontSize={14}>
            <Link onClick={(e) => setFormPage('forgotPassword')}>
              Forgot password?
            </Link>{' '}
          </Text>
        </HStack>
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

function useFormAction<Values extends { [key: string]: any }>({
  name,
  initialValues,
  submit,
}: {
  name: string
  initialValues: Values
  submit: (n: Values) => Promise<any>
}) {
  const { handleSubmit, errors, control } = useForm()
  const data = useRef(initialValues)
  const [send, setSend] = useState(0)
  const response = useQueryLoud([name, send], () => submit(data.current), {
    enabled: !!send,
  })
  console.log('response', response)
  const onSubmit = handleSubmit(() => {
    setSend(Math.random())
  })
  const onChange = (key: keyof Values) => (val: string) => {
    // @ts-expect-error
    data.current[key] = val
  }
  return {
    errors,
    control,
    response,
    onChange,
    onSubmit,
  }
}

const SignupForm = ({ autoFocus }: AuthFormProps) => {
  const { onChange, onSubmit, control, errors } = useFormAction({
    name: 'register',
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    submit: (obj) =>
      userFetch('POST', '/api/user/new', obj).then((res) => {
        if (res.success) {
          userStore.setUser(res.user)
        }
        return res
      }),
  })

  return (
    <SubmittableForm onSubmit={onSubmit} submitText="Signup">
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
