import { sleep } from '@dish/async'
import {
  Auth,
  EditUserProps,
  Review,
  User,
  query,
  resolved,
  setCache,
  userEdit,
  userFetchSimple,
} from '@dish/graph'
import { Toast } from '@dish/ui'
import { Store, createStore, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'

import { queryUserQuery } from '../queries/queryUser'
import { router } from '../router'
import { appMenuStore } from './AppMenuStore'

type ThemeName = 'dark' | 'light' | 'auto'

const hasLoggedInBefore = !!localStorage.getItem('has-logged-in')

const THEME_KEY = 'user-theme'
const currentTheme = localStorage.getItem(THEME_KEY) as ThemeName

class UserStore extends Store {
  user: Partial<User> | null = null
  loading = false
  messages: string[] = []
  allVotes: { [id: string]: Review } = {}
  theme: ThemeName | null = currentTheme ?? null

  get hasLoggedInBefore() {
    return hasLoggedInBefore
  }

  get isLoggedIn() {
    return !!this.user
  }

  get isAdmin() {
    // this is ok, we secure things on backend (always)
    return this.user?.username === 'admin'
  }

  setTheme(theme: ThemeName | null) {
    if (theme) {
      localStorage.setItem(THEME_KEY, theme)
    }
    this.theme = theme
  }

  async fetch(
    method: 'POST' | 'GET',
    path: string,
    data: any = {},
    onSuccess?: (data: any) => any
  ) {
    let complete = false
    const header = await Promise.race([
      userFetchSimple(method, path, data),
      sleep(3000).then(() => {
        if (!complete) {
          Toast.error('Timed out!')
          throw new Error(`Timed out`)
        }
      }),
    ])
    if (!header) {
      return {
        error: `Timed out`,
      }
    }
    complete = true
    const isErrHead = header.status >= 300
    const res = await header.json()
    if (res.error) {
      Toast.error(res.error)
      throw res.error
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
    await this.fetch('POST', '/user/login', obj, this.afterLogin)
  }

  async register(obj) {
    await this.fetch('POST', '/user/new', obj, this.afterLogin)
  }

  async afterLogin(data) {
    appMenuStore.setIsVisible(false)
    Auth.setLoginData(data)
    await this.refreshUser(data.user)
  }

  refresh() {
    if (!this.user?.id) return
    this.refreshUser({ id: this.user.id })
  }

  promptLogin() {
    if (!this.isLoggedIn) {
      appMenuStore.show()
      Toast.show(`Welcome!`)
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
      setCache(queryUserQuery(user.username), this.user as any)
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
              },
            })
            .map((u) => ({
              id: u.id,
              name: u.name,
              username: u.username,
              avatar: u.avatar,
              about: u.about,
              location: u.location,
              has_onboarded: u.has_onboarded,
              charIndex: u.charIndex,
            }))[0],
        {
          refetch: true,
        }
      )
      if (user.id) {
        this.user = {
          ...this.user,
          ...user,
        }
        if (!this.user!.has_onboarded) {
          console.log('onboarding, go to user edit')
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
window['userStore'] = userStore
export const useUserStore = () => {
  return useStoreInstance(userStore)
}

export const useUsername = () => {
  return useStoreInstanceSelector(userStore, (x) => x.user?.username)
}
