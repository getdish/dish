import {
  Auth,
  Review,
  UpdateUserProps,
  User,
  query,
  resolved,
  userFindOne,
} from '@dish/graph'
import { Toast } from '@dish/ui'
import { Action, AsyncAction } from 'overmind'

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
      om.state.user.messages = [data]
      break
    // @ts-ignore
    case status >= 400:
      om.state.user.messages = formatErrors(data)
      break
    default:
      break
  }
  om.state.user.loading = false
  return result
}

const checkForExistingLogin: AsyncAction = async (om) => {
  if (Auth.has_been_logged_out) {
    Toast.show('Session expired: logged out')
  }
  if (Auth.isLoggedIn) {
    postLogin(om, Auth.user)
    om.actions.user.refreshUser()
  }
}

const login: AsyncAction<{
  usernameOrEmail: string
  password: string
}> = async (om, { usernameOrEmail, password }) => {
  om.state.user.loading = true
  const [status, data] = await Auth.login(usernameOrEmail, password)
  if (status >= 400) {
    om.state.user.isLoggedIn = false
    if (status == 400 || status == 401) {
      om.state.user.messages = ['Username or password not recognised']
    } else {
      om.state.user.messages = formatErrors(data)
    }
  } else {
    postLogin(om, data)
    Toast.show('Logged in as ' + om.state.user.user?.username)
  }
  om.state.user.loading = false
}

const postLogin: Action<Partial<User>> = (om, user: Partial<User>) => {
  om.state.user.isLoggedIn = true
  om.state.user.user = user as any
}

const logout: AsyncAction = async (om) => {
  await Auth.logout()
  om.state.user.user = null
  om.state.user.isLoggedIn = false
  Toast.show('Logged out')
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
  const [status] = await Auth.updateUser(props)
  if (status === 200) {
    om.state.user.user = {
      ...om.state.user.user,
      has_onboarded: true,
      ...props,
    }
    return true
  }
  return false
}

const refreshUser: AsyncAction = async (om) => {
  if (!Auth.user.id) return
  const user = await resolved(
    () =>
      query
        .user({
          where: {
            id: {
              _eq: Auth.user.id,
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
}

export const actions = {
  refreshUser,
  register,
  login,
  logout,
  checkForExistingLogin,
  ensureLoggedIn,
  updateUser,
}
