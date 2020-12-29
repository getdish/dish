import {
  Auth,
  Review,
  UpdateUserProps,
  User,
  query,
  resolved,
} from '@dish/graph'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import { Toast } from 'snackui'

import { appMenuStore } from '../AppMenuStore'
import { router } from '../../router'

class UserStore extends Store {
  user: Partial<User> | null = null
  loading = false
  messages: string[] = []
  allVotes: { [id: string]: Review } = {}

  get isLoggedIn() {
    return !!this.user
  }

  promptLogin() {
    if (!this.isLoggedIn) {
      appMenuStore.show()
      Toast.show(`Signup/login to do this`)
      return true
    }
    return false
  }

  async register({
    username,
    email,
    password,
  }: {
    username: string
    email: string
    password: string
  }) {
    let result = false
    this.loading = true
    const [status, data] = await Auth.register(username, email, password)
    switch (status) {
      case 201:
        await this.login({ usernameOrEmail: email, password })
        result = true
        break
      case 409:
        this.messages = data
        break
      default:
        break
    }
    if (status >= 400) {
      this.messages = formatErrors(data)
    }
    console.log('data', data)
    this.loading = false
    return result
  }

  async login({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail: string
    password: string
  }) {
    this.loading = true
    try {
      const [status, data] = await Auth.login(usernameOrEmail, password)
      if (status >= 400) {
        Toast.show('Error logging in', { type: 'error' })
        this.user = null
        if (status == 400 || status == 401) {
          this.messages = ['Username or password not recognised']
        } else {
          this.messages = formatErrors(data)
        }
      } else {
        this.setLogin(data)
        Toast.show('Logged in as ' + this.user?.username)
      }
    } finally {
      this.loading = false
    }
  }

  setLogin(user: Partial<User>) {
    this.user = user as any
  }

  async logout() {
    await Auth.logout()
    this.user = null
    Toast.show('Logged out')
  }

  checkForExistingLogin() {
    Auth.checkForExistingLogin()
    if (Auth.has_been_logged_out) {
      Toast.show('Session expired: logged out')
    }
    if (Auth.isLoggedIn) {
      this.setLogin(Auth.user)
      this.refreshUser()
    }
  }

  async forgotPassword(usernameOrEmail: string) {
    this.loading = true
    try {
      const [status] = await Auth.forgotPassword(usernameOrEmail)
      this.loading = false
      if (status == 204) {
        Toast.show('Password reset request sent')
        return true
      } else {
        Toast.show('Error requesting password reset', { type: 'error' })
      }
    } finally {
      this.loading = false
    }
    return false
  }

  async passwordReset({
    password,
    confirmation,
  }: {
    password: string
    confirmation: string
  }) {
    if (password != confirmation) {
      Toast.show("Passwords don't match")
      return false
    }
    this.loading = true
    const token = router.curPage.params.token
    try {
      const [status] = await Auth.passwordReset(token, password)
      this.loading = false
      if (status == 201) {
        Toast.show('Password updated')
        return true
      } else {
        Toast.show('Error updating password', { type: 'error' })
      }
    } finally {
      this.loading = false
    }
    return true
  }

  ensureLoggedIn() {
    if (this.isLoggedIn) {
      return true
    }
    Toast.show('Login to do this!')
    appMenuStore.show()
    return false
  }

  async updateUser(props: UpdateUserProps) {
    const user = await Auth.updateUser(props)
    if (user) {
      this.user = {
        ...this.user,
        ...user,
        has_onboarded: true,
        ...props,
      }
      return true
    }
    return false
  }

  private async refreshUser() {
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
        this.user = {
          ...this.user,
          ...user,
        }
      }
    } catch (err) {
      console.error(
        'ERROR WITH USER, LIKELY JWT EXPIRED, TODO react server components and fix whole stack',
        err
      )
      this.logout()
    }
  }
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

export const userStore = createStore(UserStore)
export const useUserStore = () => {
  return useStoreInstance(userStore)
}
