import { DISH_API_ENDPOINT, isNode } from './constants'
import { isSafari } from '@dish/helpers'
import AsyncStorage from '@react-native-async-storage/async-storage'

// TODO next gen!! remove all cruft!!

export type EditUserProps = {
  name: string
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
  name: string
}

export async function userEdit(user: EditUserProps): Promise<EditUserResponse | null> {
  return await (await userFetchSimple('POST', '/user/edit', user)).json()
}

export type UserFetchOpts = {
  isAdmin?: boolean
  handleLogOut?: () => void
  rawData?: boolean
  headers?: {
    [key: string]: any
  }
}

export async function userFetchSimple(
  method: 'POST' | 'GET',
  path: string,
  data: any = {},
  { handleLogOut, rawData, isAdmin, headers }: UserFetchOpts = {}
) {
  const init: RequestInit = {
    method,
    headers: {
      ...headers,
      ...(await getAuthHeaders(isAdmin)),
      ...(!rawData && {
        'Content-Type': 'application/json',
      }),
      Accept: 'application/json',
    },
    body: rawData ? data : JSON.stringify(data),
  }
  const url = DISH_API_ENDPOINT + path
  const response = await fetch(url, init)
  if (response.status >= 300) {
    if (response.status == 401) {
      handleLogOut?.()
    }
    console.log('Auth fetch() error', url, method, response.status, response.statusText)
  }
  return response
}

class AuthModel {
  public jwt = ''
  public isLoggedIn = false
  public isAdmin = false
  public user: any = {}
  public has_been_logged_out = false

  getRedirectUri() {
    return isSafari
      ? `${DISH_API_ENDPOINT}/user/appleAuthorize`
      : `${DISH_API_ENDPOINT}/user/appleAuthorizeChrome`
  }

  constructor(public hasEverLoggedIn: boolean) {
    if (isNode) {
      this.isLoggedIn = true
      this.isAdmin = true
    }
  }

  async checkForExistingLogin() {
    const json = await AsyncStorage.getItem(LOGIN_KEY)
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

  async api(method: 'POST' | 'GET', path: string, data: any = {}, opts?: UserFetchOpts) {
    return await userFetchSimple(method, path, data, {
      ...opts,
      isAdmin: this.isAdmin,
      handleLogOut: () => {
        this.isLoggedIn = false
        this.isAdmin = false
        this.user = null
      },
    })
  }

  // only used server side
  as(role: string) {
    if (role == 'admin') {
      this.isAdmin = true
    } else {
      this.isAdmin = false
    }
  }

  async register(username: string, email: string, password: string) {
    const response = await this.api('POST', '/user/new', {
      username,
      password,
      email,
    })
    if (response.status !== 201) {
      console.error(`Error registering: ${response.status} ${response.statusText}`)
      const data = await response.json()
      return [response.status, data] as const
    } else {
      await AsyncStorage.setItem(HAS_LOGGED_IN_BEFORE, 'true')
    }
    return [response.status, response.statusText] as const
  }

  async login(login: string, password: string) {
    if (!login || !password) {
      throw new Error(`no login/password`)
    }
    const response = await this.api('POST', '/user/login', {
      login,
      password,
    })
    if (response.status != 201 && response.status != 200) {
      console.warn(`Couldn't login, invalid login or password or missing user`)
      return [response.status, response.statusText] as const
    }
    const data = await response.json()
    this.setLoginData(data)
    return [response.status, data.user] as const
  }

  async setLoginData(data: { user: any; token: string }) {
    if (!data.token) {
      throw new Error(`INVALID NO TOKEN`)
    }
    this.isLoggedIn = true
    this.jwt = data.token
    this.user = data.user
    await AsyncStorage.setItem(HAS_LOGGED_IN_BEFORE, 'true')
    await AsyncStorage.setItem(LOGIN_KEY, JSON.stringify(data))
    this.has_been_logged_out = false
  }

  // mostly same as login
  async appleAuth(authorization: { id_token: string; code: string }) {
    const response = await this.api('POST', '/user/appleVerify', {
      ...authorization,
      redirectUri: Auth.getRedirectUri(),
    })
    if (response.status != 201 && response.status != 200) {
      console.warn(`Couldn't login apple auth`)
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
    await AsyncStorage.removeItem(LOGIN_KEY)
  }
}

export let Auth: AuthModel

export function getAuth() {
  if (!Auth) throw new Error(`Must call createAuth() first`)
  return Auth
}

export async function createAuth() {
  const hasEverLoggedIn = Boolean(await AsyncStorage.getItem(HAS_LOGGED_IN_BEFORE))
  Auth = new AuthModel(hasEverLoggedIn)
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window['Auth'] = Auth
}

export const LOGIN_KEY = 'auth'
export const HAS_LOGGED_IN_BEFORE = 'HAS_LOGGED_IN_BEFORE'

export async function getAuthInfo(): Promise<null | {
  user: Object
  token: string
  admin?: boolean
}> {
  const json = await AsyncStorage.getItem(LOGIN_KEY)
  if (json != null) {
    return JSON.parse(json)
  }
  return null
}

export async function getAuthHeaders(isAdmin?: boolean) {
  const auth = await getAuthInfo()
  return {
    ...(auth && {
      Authorization: `Bearer ${auth.token}`,
    }),
  }
}
