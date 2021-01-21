import { isSafari } from '@dish/helpers'

import { DISH_API_ENDPOINT, isNode } from './constants'
import { HAS_LOGGED_IN_BEFORE, LOGIN_KEY, getAuthHeaders } from './getAuth'

// TODO next gen!! remove all cruft!!

export type EditUserProps = {
  username: string
  about?: string
  location?: string
  charIndex?: number
}

export type EditUserResponse = {
  email: string
  has_onboarded: boolean
  about: string
  location: string
  charIndex: number
  username: string
}

export async function userEdit(
  user: EditUserProps
): Promise<EditUserResponse | null> {
  return await (await userFetchSimple('POST', '/api/user/edit', user)).json()
}

type UserFetchOpts = { handleLogOut?: () => void; rawData?: boolean }

export async function userFetchSimple(
  method: 'POST' | 'GET',
  path: string,
  data: any = {},
  { handleLogOut, rawData }: UserFetchOpts = {}
) {
  const init: RequestInit = {
    method,
    headers: {
      ...getAuthHeaders(),
      ...(!rawData && {
        'Content-Type': 'application/json',
      }),
      Accept: 'application/json',
    },
    body: rawData ? data : JSON.stringify(data),
  }
  const response = await fetch(DISH_API_ENDPOINT + path, init)
  if (response.status >= 300) {
    if (response.status == 401) {
      handleLogOut?.()
    }
    console.error('Auth fetch() error', method, path, data)
  }
  return response
}

class AuthModel {
  public jwt = ''
  public isLoggedIn = false
  public is_admin = false
  public user: any = {}
  public has_been_logged_out = false

  getRedirectUri() {
    return isSafari
      ? `${DISH_API_ENDPOINT}/api/user/appleAuthorize`
      : `${DISH_API_ENDPOINT}/api/user/appleAuthorizeChrome`
  }

  hasEverLoggedIn =
    typeof window !== 'undefined' &&
    !!localStorage.getItem(HAS_LOGGED_IN_BEFORE)

  constructor() {
    if (isNode) {
      this.isLoggedIn = true
      this.is_admin = true
    }
  }

  checkForExistingLogin() {
    const json = localStorage.getItem(LOGIN_KEY)
    if (json != null) {
      const auth = JSON.parse(json)
      this.jwt = auth.token
      this.user = {
        ...auth.user,
        has_onboarded: true,
      }
      this.isLoggedIn = true
    }
  }

  async api(
    method: 'POST' | 'GET',
    path: string,
    data: any = {},
    opts?: UserFetchOpts
  ) {
    return await userFetchSimple(method, path, data, {
      ...opts,
      handleLogOut: () => {
        this.isLoggedIn = false
        this.user = null
        this.is_admin = false
      },
    })
  }

  as(role: string) {
    if (role == 'admin') {
      this.is_admin = true
    } else {
      this.is_admin = false
    }
  }

  async uploadAvatar(body: FormData) {
    const response = await this.api('POST', '/api/user/uploadAvatar', body, {
      rawData: true,
    })
    if (response.status !== 200) {
      console.error(`Error updating: ${response.status} ${response.statusText}`)
      return null
    }
    return await response.json()
  }

  async register(username: string, email: string, password: string) {
    const response = await this.api('POST', '/api/user/new', {
      username,
      password,
      email,
    })
    if (response.status !== 201) {
      console.error(
        `Error registering: ${response.status} ${response.statusText}`
      )
      const data = await response.json()
      return [response.status, data] as const
    } else {
      localStorage.setItem(HAS_LOGGED_IN_BEFORE, 'true')
    }
    return [response.status, response.statusText] as const
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new Error(`no username/password`)
    }
    const response = await this.api('POST', '/api/user/login', {
      username,
      password,
    })
    if (response.status != 201 && response.status != 200) {
      console.error(
        `Couldn't login, invalid username or password or missing user`
      )
      return [response.status, response.statusText] as const
    }
    const data = await response.json()
    this.setLoginData(data)
    return [response.status, data.user] as const
  }

  setLoginData(data: { user: any; token: string }) {
    console.log('setLoginData', data)
    if (!data.token) {
      throw new Error(`INVALID NO TOKEN`)
    }
    this.isLoggedIn = true
    this.jwt = data.token
    this.user = data.user
    localStorage.setItem(HAS_LOGGED_IN_BEFORE, 'true')
    localStorage.setItem(LOGIN_KEY, JSON.stringify(data))
    this.has_been_logged_out = false
  }

  // mostly same as login
  async appleAuth(authorization: { id_token: string; code: string }) {
    const response = await this.api('POST', '/api/user/appleVerify', {
      ...authorization,
      redirectUri: Auth.getRedirectUri(),
    })
    if (response.status != 201 && response.status != 200) {
      console.error(`Couldn't login apple auth`)
      throw new Error(response.statusText)
    }
    const data = await response.json()
    this.setLoginData(data)
    return data
  }

  async logout() {
    console.warn('logout')
    this.isLoggedIn = false
    this.jwt = ''
    this.user = null
    localStorage.removeItem(LOGIN_KEY)
  }
}

export const Auth = new AuthModel()

if (typeof window !== 'undefined') {
  window['Auth'] = Auth
}
