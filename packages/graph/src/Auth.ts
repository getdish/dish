import { isSafari } from '@dish/helpers'

import { AUTH_DOMAIN, ORIGIN, isNode } from './constants'

const LOGIN_KEY = 'auth'
const HAS_LOGGED_IN_BEFORE = 'HAS_LOGGED_IN_BEFORE'
// TODO put this away! in localstorage i think
const HASURA_SECRET =
  process.env.HASURA_SECRET || process.env.REACT_APP_HASURA_SECRET || 'password'

export type UpdateUserProps = {
  username: string
  about?: string
  location?: string
  charIndex?: number
}

console.log('polyfill now')
require('@dish/helpers/polyfill')

export function getAuth(): null | {
  user: Object
  token: string
  admin?: boolean
} {
  const json = localStorage.getItem(LOGIN_KEY)
  if (json != null) {
    return JSON.parse(json)
  }
  return null
}

export function getAuthHeaders() {
  const auth = getAuth()
  if (auth) {
    return {
      ...(auth.admin && {
        'X-Hasura-Admin-Secret': HASURA_SECRET,
      }),
      Authorization: `Bearer ${auth.token}`,
    }
  }
  return null
}

export async function userFetch(
  method: 'POST' | 'GET',
  path: string,
  data: any = {},
  { onLoggedOut }: { onLoggedOut?: () => void } = {}
) {
  const response = await fetch(ORIGIN + path, {
    method,
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (response.status >= 300) {
    if (response.status == 401) {
      onLoggedOut?.()
    } else {
      console.error('Auth fetch() error', {
        method,
        domain: ORIGIN,
        path,
        data,
        status: response.status,
        statusText: response.statusText,
      })
    }
  }
  return await response.json()
}

class AuthModel {
  public jwt = ''
  public isLoggedIn = false
  public is_admin = false
  public user: any = {}
  public has_been_logged_out = false

  getRedirectUri() {
    return isSafari
      ? `${AUTH_DOMAIN}/auth/apple_authorize`
      : `${AUTH_DOMAIN}/auth/apple_authorize_chrome`
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

  async api(method: 'POST' | 'GET', path: string, data: any = {}) {
    return await userFetch(method, path, data, {
      onLoggedOut: () => {
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
    const response = await this.api('POST', '/user/uploadAvatar', body)
    if (response.status !== 200) {
      console.error(`Error updating: ${response.status} ${response.statusText}`)
      return null
    }
    return await response.json()
  }

  async updateUser(
    user: UpdateUserProps
  ): Promise<{
    email: string
    has_onboarded: boolean
    about: string
    location: string
    charIndex: number
    username: string
  } | null> {
    const response = await this.api('POST', '/user/updateUser', user)
    if (response.status !== 200) {
      console.error(`Error updating: ${response.status} ${response.statusText}`)
      return null
    }
    return await response.json()
  }

  async register(username: string, email: string, password: string) {
    const response = await this.api('POST', '/user', {
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
    const response = await this.api('POST', '/auth/login', {
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
    this.isLoggedIn = true
    this.jwt = data.token
    this.user = data.user
    localStorage.setItem(HAS_LOGGED_IN_BEFORE, 'true')
    localStorage.setItem(
      LOGIN_KEY,
      JSON.stringify({
        token: this.jwt,
        user: this.user,
      })
    )
    this.has_been_logged_out = false
    return [response.status, data.user] as const
  }

  // mostly same as login
  async appleAuth(authorization: { id_token: string; code: string }) {
    const response = await this.api('POST', '/auth/apple_verify', {
      ...authorization,
      redirectUri: Auth.getRedirectUri(),
    })
    if (response.status != 201 && response.status != 200) {
      console.error(`Couldn't login apple auth`)
      throw new Error(response.statusText)
    }

    const data = await response.json()
    this.isLoggedIn = true
    this.jwt = data.token
    this.user = data.user
    localStorage.setItem(
      LOGIN_KEY,
      JSON.stringify({
        token: this.jwt,
        user: this.user,
      })
    )
    this.has_been_logged_out = false
    return data.user as {
      username: string
      location: string
      about: string
      avatar: string
    }
  }

  async forgotPassword(username: string) {
    if (!username) {
      throw new Error(`no username/email`)
    }
    const response = await this.api('POST', '/auth/forgot-password', {
      username,
    })

    if (response.status != 204) {
      console.error(`Couldn't send forgotten password request`)
      return [response.status, response.statusText] as const
    }

    return [response.status] as const
  }

  async passwordReset(token: string, password: string) {
    if (!token) {
      throw new Error(`no password reset token`)
    }

    if (!password) {
      throw new Error(`no password to reset`)
    }
    const response = await this.api('POST', '/auth/password-reset', {
      token,
      password,
    })

    if (response.status != 201) {
      console.error(`Couldn't reset password`)
      return [response.status, response.statusText] as const
    }

    return [response.status] as const
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
