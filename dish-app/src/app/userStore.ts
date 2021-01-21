import { sleep } from '@dish/async'
import {
  Auth,
  EditUserProps,
  Review,
  User,
  query,
  resolved,
  userEdit,
  userFetchSimple,
} from '@dish/graph'
import { Store, createStore, useStoreInstance } from '@dish/use-store'
import { Toast } from 'snackui'

import { router } from '../router'
import { appMenuStore } from './AppMenuStore'

class UserStore extends Store {
  user: Partial<User> | null = null
  loading = false
  messages: string[] = []
  allVotes: { [id: string]: Review } = {}

  get isLoggedIn() {
    return !!this.user
  }

  async fetch(
    method: 'POST' | 'GET',
    path: string,
    data: any = {},
    onSuccess?: (data: any) => any
  ) {
    const header = await Promise.race([
      userFetchSimple(method, path, data),
      sleep(3000).then(() => {
        Toast.error('Timed out!')
        throw new Error(`Timed out`)
      }),
    ])
    if (!header) {
      return {
        error: `Timed out`,
      }
    }
    const isErrHead = header.status >= 300
    const res = await header.json()
    if (res.error) {
      Toast.error(res.error)
    }
    if (res.success) {
      Toast.show(res.success)
    }
    if (!res.error && !isErrHead) {
      onSuccess?.(res)
      return res
    }
    console.warn(`fetch err ${path} - ${header.statusText}`, res)
    return res
  }

  async login(obj) {
    await this.fetch('POST', '/api/user/login', obj, this.afterLogin)
  }

  async register(obj) {
    await this.fetch('POST', '/api/user/new', obj, this.afterLogin)
  }

  async afterLogin(data) {
    Auth.setLoginData(data)
    await this.refreshUser(data.user)
  }

  refresh() {
    if (!this.user.id) return
    this.refreshUser({ id: this.user.id })
  }

  promptLogin() {
    if (!this.isLoggedIn) {
      appMenuStore.show()
      Toast.show(`Signup/login to do this`)
      return true
    }
    return false
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
      this.refreshUser(Auth.user)
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

  async edit(props: EditUserProps) {
    const user = await userEdit(props)
    if (user) {
      this.user = {
        ...this.user,
        ...props,
        ...user,
        has_onboarded: true,
      }
      Toast.success(`Updated`)
      return true
    }
    Toast.error(`Failed editing`)
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
                // name: {
                //   _neq: `${Math.random()}`,
                // },
              },
            })
            .map((u) => ({
              id: u.id,
              username: u.username,
              avatar: u.avatar,
              about: u.about,
              location: u.location,
              has_onboarded: u.has_onboarded,
            }))[0],
        {
          refetch: true,
        }
      )
      console.log('refreshed user', user)
      if (user) {
        this.user = {
          ...this.user,
          ...user,
        }

        if (!this.user.has_onboarded) {
          console.log('go to user edit')
          router.navigate({
            name: 'userEdit',
          })
        }
      }
    } catch (err) {
      console.error(
        'ERROR WITH USER, LIKELY JWT EXPIRED, TODO react server components and fix whole stack',
        err,
        err.stack,
        err.message
      )
      this.logout()
    }
  }
}

export const userStore = createStore(UserStore)
export const useUserStore = () => {
  return useStoreInstance(userStore)
}
