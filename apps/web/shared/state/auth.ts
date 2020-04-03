import DishAuth from '@dish/auth'
import { User } from '@dish/models'
import { Action, AsyncAction } from 'overmind'

import { Toast } from '../views/App'

type AuthState = {
  user: Partial<User>
  loading: boolean
  messages: string[]
  is_logged_in: boolean
}

export const state: AuthState = {
  user: {} as User,
  loading: false,
  messages: [],
  is_logged_in: false,
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
  { username: string; password: string },
  boolean
> = async (om, { username, password }) => {
  let result = false
  om.state.auth.loading = true
  const [status, data] = await DishAuth.register(username, password)
  switch (status) {
    case 201:
      om.state.auth.messages = ['Registered. You can now login.']
      result = true
      break
    case 409:
      om.state.auth.messages = [data]
      break
    case status >= 400:
      om.state.auth.messages = formatErrors(data)
      break
    default:
      break
  }
  om.state.auth.loading = false
  return result
}

const checkForExistingLogin: Action = (om) => {
  if (DishAuth.has_been_logged_out) {
    Toast.show('Session expired: logged out')
  }
  if (DishAuth.is_logged_in) {
    postLogin(om, DishAuth.user)
  }
}

const login: AsyncAction<{ username: string; password: string }> = async (
  om,
  { username, password }
) => {
  om.state.auth.loading = true
  const [status, data] = await DishAuth.login(username, password)
  if (status >= 400) {
    om.state.auth.is_logged_in = false
    if (status == 400 || status == 401) {
      om.state.auth.messages = ['Username or password not recognised']
    } else {
      om.state.auth.messages = formatErrors(data)
    }
  } else {
    postLogin(om, data)
    Toast.show('Logged in as ' + om.state.auth.user.username)
  }
  om.state.auth.loading = false
}

const postLogin: Action<Partial<User>> = (om, user: Partial<User>) => {
  om.state.auth.is_logged_in = true
  om.state.auth.user = user
}

const logout: AsyncAction = async (om) => {
  DishAuth.logout()
  om.state.auth.user = {} as User
  om.state.auth.is_logged_in = false
  Toast.show('Logged out')
}

const ensureLoggedIn: Action<void, boolean> = (om) => {
  if (om.state.auth.is_logged_in) {
    return true
  }
  Toast.show('Login to do this!')
  om.actions.home.setShowUserMenu(true)
  return false
}

export const actions = {
  register,
  login,
  logout,
  checkForExistingLogin,
  ensureLoggedIn,
}
