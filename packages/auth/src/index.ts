import 'isomorphic-unfetch'

const BROWSER_STORAGE_KEY = 'auth'
const LOCAL_AUTH_SERVER = 'http://localhost:3000'
const PROD_JWT_SERVER = 'https://auth.rio.dishapp.com'

const isNode = typeof window == 'undefined'
const isBrowserProd = !isNode && window.location.hostname.includes('dish')

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

class Auth {
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
      body: JSON.stringify(data),
    }).then((res) => res.json())
    if (response.status == 401) {
      this.has_been_logged_out = true
      this.logout()
    }
    return response
  }

  async register(username: string, password: string) {
    const response = await this.api('post', '/user', {
      username: username,
      password: password,
    })
    return [response.status, response.data]
  }

  async login(username: string, password: string) {
    let status = 500
    const response = await fetch(`${DOMAIN}/auth/login`, {
      method: 'post',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((res) => {
      status = res.status
      return res.json()
    })
    this.isLoggedIn = true
    this.jwt = response.token
    this.user = response.user
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
    return [status, response.user]
  }

  async logout() {
    this.isLoggedIn = false
    delete this.jwt
    delete this.user
    localStorage.removeItem(BROWSER_STORAGE_KEY)
  }
}

export const DishAuth = new Auth()

export default DishAuth
