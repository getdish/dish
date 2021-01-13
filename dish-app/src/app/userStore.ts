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

import { appMenuStore } from './AppMenuStore'

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

  async setUser(user: { id: string }) {
    await this.refreshUser(user)
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
      this.setUser(Auth.user)
    }
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

  private async refreshUser({ id }: { id: string }) {
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
