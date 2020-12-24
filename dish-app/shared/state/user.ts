import {
  Auth,
  Review,
  UpdateUserProps,
  User,
  query,
  resolved,
} from '@dish/graph'
import { Action, AsyncAction } from 'overmind'
import { Toast } from 'snackui'

import { getRouter } from './router'

type UserState = {
  user: Partial<User> | null
  loading: boolean
  messages: string[]
  isLoggedIn: boolean
  allVotes: { [id: string]: Review }
}

export const state: UserState = {
  user: {} as User,
  loading: false,
  messages: [],
  isLoggedIn: false,
  allVotes: {},
}

const formatErrors = (torm_errors: any) => {
  let errors: string[] = []
  for (const torm_error of torm_errors) {
    for (const entry of Object.entries(torm_error.constraints)) {
      errors.push(entry[1] as string)
    }
  }
  return errors
}

const register: AsyncAction<
  { username: string; email: string; password: string },
  boolean
> = async (om, { username, email, password }) => {
  let result = false
  om.state.user.loading = true
  const [status, data] = await Auth.register(username, email, password)
  switch (status) {
    case 201:
      await om.actions.user.login({ usernameOrEmail: email, password })
      result = true
      break
    case 409:
      om.state.user.messages = data
      break
    default:
      break
  }
  if (status >= 400) {
    om.state.user.messages = formatErrors(data)
  }
  console.log('data', data)
  om.state.user.loading = false
  return result
}

const checkForExistingLogin: AsyncAction = async (om) => {
  Auth.checkForExistingLogin()
  if (Auth.has_been_logged_out) {
    Toast.show('Session expired: logged out')
  }
  if (Auth.isLoggedIn) {
    setLogin(om, Auth.user)
    om.actions.user.refreshUser()
  }
}

const login: AsyncAction<{
  usernameOrEmail: string
  password: string
}> = async (om, { usernameOrEmail, password }) => {
  om.state.user.loading = true
  try {
    const [status, data] = await Auth.login(usernameOrEmail, password)
    if (status >= 400) {
      Toast.show('Error logging in', { type: 'error' })
      om.state.user.isLoggedIn = false
      if (status == 400 || status == 401) {
        om.state.user.messages = ['Username or password not recognised']
      } else {
        om.state.user.messages = formatErrors(data)
      }
    } else {
      setLogin(om, data)
      Toast.show('Logged in as ' + om.state.user.user?.username)
    }
  } finally {
    om.state.user.loading = false
  }
}

const setLogin: Action<Partial<User>> = (om, user: Partial<User>) => {
  om.state.user.isLoggedIn = true
  om.state.user.user = user as any
}

const logout: AsyncAction = async (om) => {
  await Auth.logout()
  om.state.user.user = null
  om.state.user.isLoggedIn = false
  Toast.show('Logged out')
}

//@ts-expect-error overmind type error
const forgotPassword: AsyncAction<{
  usernameOrEmail: string
}> = async (om, { usernameOrEmail }) => {
  om.state.user.loading = true
  try {
    const [status] = await Auth.forgotPassword(usernameOrEmail)
    om.state.user.loading = false
    if (status == 204) {
      Toast.show('Password reset request sent')
      return true
    } else {
      Toast.show('Error requesting password reset', { type: 'error' })
    }
  } finally {
    om.state.user.loading = false
  }
  return false
}

//@ts-expect-error overmind type error
const passwordReset: AsyncAction<{
  password: string
  confirmation: string
}> = async (om, { password, confirmation }) => {
  if (password != confirmation) {
    Toast.show("Passwords don't match")
    return false
  }
  om.state.user.loading = true
  const token = getRouter().curPage.params.token
  try {
    const [status] = await Auth.passwordReset(token, password)
    om.state.user.loading = false
    if (status == 201) {
      Toast.show('Password updated')
      return true
    } else {
      Toast.show('Error updating password', { type: 'error' })
    }
  } finally {
    om.state.user.loading = false
  }
  return true
}

const ensureLoggedIn: Action<void, boolean> = (om) => {
  if (om.state.user.isLoggedIn) {
    return true
  }
  Toast.show('Login to do this!')
  om.actions.home.setShowUserMenu(true)
  return false
}

const updateUser: AsyncAction<UpdateUserProps, boolean> = async (om, props) => {
  const user = await Auth.updateUser(props)
  if (user) {
    om.state.user.user = {
      ...om.state.user.user,
      ...user,
      has_onboarded: true,
      ...props,
    }
    return true
  }
  return false
}

const refreshUser: AsyncAction = async (om) => {
  const id = Auth.user.id
  if (!id) return
  try {
    const user = await resolved(
      () =>
        query
          .user({
            where: {
              id: {
                _eq: id,
              },
            },
          })
          .map((u) => ({
            id: u.id,
            username: u.username,
            avatar: u.avatar,
            about: u.about,
            location: u.location,
            has_onboarded: u.has_onboarded,
          }))[0]
    )
    if (user) {
      om.state.user.user = {
        ...om.state.user.user,
        ...user,
      }
    }
  } catch (err) {
    console.error(
      'ERROR WITH USER, LIKELY JWT EXPIRED, TODO react server components and fix whole stack',
      err
    )

    //
    om.actions.user.logout()
  }
}

export const actions = {
  refreshUser,
  register,
  login,
  logout,
  forgotPassword,
  passwordReset,
  checkForExistingLogin,
  ensureLoggedIn,
  updateUser,
  setLogin,
}
