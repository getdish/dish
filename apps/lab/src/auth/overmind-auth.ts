import { AsyncAction } from 'overmind'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import auth from '@dish/auth'
import { User, createApolloClient } from '@dish/models'

type AuthState = {
  user: User
  loading: boolean
  messages: string[]
  is_logged_in: boolean
  apollo_client: ApolloClient<NormalizedCacheObject>
}

export const state: AuthState = {
  user: {} as User,
  loading: false,
  messages: [],
  is_logged_in: false,
  apollo_client: {} as ApolloClient<NormalizedCacheObject>,
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
  const [status, data] = await auth.register(username, password)
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

const login: AsyncAction<{ username: string; password: string }> = async (
  om,
  { username, password }
) => {
  om.state.auth.loading = true
  const [status, data] = await auth.login(username, password)
  if (status >= 400) {
    om.state.auth.is_logged_in = false
    if (status == 400 || status == 401) {
      om.state.auth.messages = ['Username or password not recognised']
    } else {
      om.state.auth.messages = formatErrors(data)
    }
  } else {
    om.state.auth.apollo_client = await createApolloClient()
    om.state.auth.is_logged_in = true
    om.state.auth.user = data
  }
  om.state.auth.loading = false
}

const logout: AsyncAction = async om => {
  auth.logout()
  om.state.auth.user = {} as User
  om.state.auth.is_logged_in = false
}

export const actions = {
  register: register,
  login: login,
  logout: logout,
}
