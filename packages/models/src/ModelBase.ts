import axios, { AxiosRequestConfig } from 'axios'

const DOMAIN = process.env.HASURA_ENDPOINT || 'http://localhost:8080'
const AXIOS_CONF = {
  url: DOMAIN + '/v1/graphql',
  method: 'GET',
  data: {
    query: '',
  },
} as AxiosRequestConfig

export default class ModelBase {
  async hasura(gql: string) {
    let conf = AXIOS_CONF
    conf.method = gql.startsWith('mutation') ? 'POST' : 'GET'
    conf.data.query = gql
    const response = await axios(conf)
    if (response.data.errors) {
      throw response.data.errors
    }
    return response
  }

  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  stringify(object: any) {
    if (Array.isArray(object)) {
      return JSON.stringify(object).replace(/"/g, '')
    }
    if (typeof object !== 'object') {
      return JSON.stringify(object)
    }
    let props = Object.keys(object)
      .map(key => `${key}:${this.stringify(object[key])}`)
      .join(',')
    return `{${props}}`
  }
}
