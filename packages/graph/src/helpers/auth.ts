import { isBrowserProd, isNode } from '../constants'

const BROWSER_STORAGE_KEY = 'auth'
const LOCAL_AUTH_SERVER = 'http://localhost:3000'
const PROD_JWT_SERVER = 'https://auth.rio.dishapp.com'

const DOMAIN = (() => {
  if (isNode) {
    return process.env.AUTH_ENDPOINT || LOCAL_AUTH_SERVER
  } else {
    if (isBrowserProd) {
      return PROD_JWT_SERVER
    } else {
      if (window.location.hostname.includes('hasura_live')) {
        return PROD_JWT_SERVER
      } else {
        return process.env.REACT_APP_AUTH_ENDPOINT || LOCAL_AUTH_SERVER
      }
    }
  }
})()

class AuthModel {
  public jwt = ''
  public isLoggedIn = false
  public is_admin = false
  public user: any = {}
  public has_been_logged_out = false

  constructor() {
    if (isNode) {
      this.isLoggedIn = true
      this.is_admin = true
    } else {
      this.checkForExistingLogin()
    }
  }

  checkForExistingLogin() {
    const json = localStorage.getItem(BROWSER_STORAGE_KEY)
    if (json != null) {
      const auth = JSON.parse(json)
      this.jwt = auth.token
      this.user = auth.user
      this.isLoggedIn = true
    }
  }

  as(role: string) {
    if (role == 'admin') {
      this.is_admin = true
    } else {
      this.is_admin = false
    }
  }

  getHeaders() {
    let auth_headers = {}
    if (this.isLoggedIn) {
      if (this.is_admin) {
        auth_headers = {
          'X-Hasura-Admin-Secret':
            process.env.HASURA_SECRET ||
            process.env.REACT_APP_HASURA_SECRET ||
            'password',
        }
      } else {
        auth_headers = {
          Authorization: 'Bearer ' + this.jwt,
        }
      }
    }
    return auth_headers
  }

  async api(method: string, path: string, data: any = {}) {
    const response = await fetch(DOMAIN + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (response.status >= 300) {
      if (response.status == 401) {
        this.has_been_logged_out = true
        this.logout()
      } else {
        const error = {
          method: method,
          domain: DOMAIN,
          path: path,
          data: data,
          status: response.status,
          statusText: response.statusText,
        }
        throw new Error(
          `Auth fetch() error:\n${JSON.stringify(error, null, 2)}`
        )
      }
    }
    return response
  }

  async register(username: string, password: string) {
    const response = await this.api('post', '/user', {
      username: username,
      password: password,
    })
    if (response.status !== 201) {
      console.error(
        `Error registering: ${response.status} ${response.statusText}`
      )
    }
    return [response.status, response.statusText] as const
  }

  async login(username: string, password: string) {
    const response = await this.api('post', '/auth/login', {
      username: username,
      password: password,
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
    if (!isNode) {
      localStorage.setItem(
        BROWSER_STORAGE_KEY,
        JSON.stringify({
          token: this.jwt,
          user: this.user,
        })
      )
      this.has_been_logged_out = false
    }
    return [response.status, data.user] as const
  }

  async logout() {
    this.isLoggedIn = false
    this.jwt = ''
    this.user = null
    if (!isNode) {
      localStorage.removeItem(BROWSER_STORAGE_KEY)
    }
  }
}

export const Auth = new AuthModel()
