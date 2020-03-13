import axios, { AxiosRequestConfig } from 'axios'

const BROWSER_STORAGE_KEY = 'auth'
const LOCAL_AUTH_SERVER = 'http://localhost:3000'
let DOMAIN: string

const isNode = typeof window == 'undefined'
const isBrowserProd = !isNode && window.location.hostname.includes('dish')

if (isNode) {
  DOMAIN = process.env.AUTH_ENDPOINT || LOCAL_AUTH_SERVER
} else {
  if (isBrowserProd) {
    DOMAIN = 'https://auth.rio.dishapp.com'
  } else {
    DOMAIN = process.env.REACT_APP_AUTH_ENDPOINT || LOCAL_AUTH_SERVER
  }
}

axios.defaults.validateStatus = () => {
  return true
}

class Auth {
  public jwt = ''
  public is_logged_in = false
  public is_admin = false
  public user = {}
  public has_been_logged_out = false

  constructor() {
    if (isNode) {
      this.is_logged_in = true
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
      this.is_logged_in = true
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
    if (this.is_logged_in) {
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

  async api(
    method: AxiosRequestConfig['method'],
    path: string,
    data: AxiosRequestConfig['data'] = {}
  ) {
    let config: AxiosRequestConfig = {
      method: method,
      url: DOMAIN + path,
    }

    if (data != {}) {
      config.data = data
    }
    const response = await axios(config)
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
    const response = await axios.post(DOMAIN + '/auth/login', {
      username: username,
      password: password,
    })
    if (response.status == 200) {
      this.is_logged_in = true
      this.jwt = response.data.token
      this.user = response.data.user
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
    }
    return [response.status, response.data.user]
  }

  async logout() {
    this.is_logged_in = false
    delete this.jwt
    delete this.user
    localStorage.removeItem(BROWSER_STORAGE_KEY)
  }
}

export default new Auth()
