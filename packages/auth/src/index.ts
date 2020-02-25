import axios, { AxiosRequestConfig } from 'axios'

const LOCAL_AUTH_SERVER = 'http://localhost:3000'
let DOMAIN: string

if (typeof window == 'undefined') {
  DOMAIN = process.env.AUTH_ENDPOINT || LOCAL_AUTH_SERVER
} else {
  if (window.location.hostname.includes('dish')) {
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

  constructor() {
    if (typeof window == 'undefined') {
      this.is_logged_in = true
      this.is_admin = true
    }
  }

  as(role: string) {
    if (role == 'admin') {
      this.is_admin = true
    } else {
      this.is_admin = false
    }
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
    if (response.status >= 300) {
      console.error(response.data)
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
      this.jwt = response.data
    }
    return [response.status, response.data]
  }
}

export default new Auth()
