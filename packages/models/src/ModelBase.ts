import axios, { AxiosRequestConfig } from 'axios'

export type Point = {
  type: string
  coordinates: [number, number]
}

const LOCAL_HASURA = 'http://localhost:8080'
let DOMAIN: string

if (typeof window == 'undefined') {
  DOMAIN =
    process.env.HASURA_ENDPOINT ||
    process.env.REACT_APP_HASURA_ENDPOINT ||
    LOCAL_HASURA
} else {
  if (window.location.hostname.includes('dish')) {
    DOMAIN = 'https://hasura.rio.dishapp.com'
  } else {
    DOMAIN = LOCAL_HASURA
  }
}

const AXIOS_CONF = {
  url: DOMAIN + '/v1/graphql',
  method: 'POST',
  data: {
    query: '',
  },
} as AxiosRequestConfig

export class ModelBase<T> {
  id!: string
  created_at!: Date
  updated_at!: Date

  static fields() {
    console.error('fields() not implemented')
    return ['']
  }

  constructor(init?: Partial<T>) {
    Object.assign(this, init)
  }

  asObject() {
    let object = {}
    // TODO: TS complains with:
    //   `error TS2339: Property 'fields' does not exist on type 'Function'.`
    // @ts-ignore
    for (const field of this.constructor.fields()) {
      object[field] = this[field]
    }
    return ModelBase.stringify(object)
  }

  static async hasura(gql: string) {
    let conf = AXIOS_CONF
    conf.data.query = gql
    const response = await axios(conf)
    if (response.data.errors) {
      console.error(gql)
      throw response.data.errors
    }
    return response
  }

  static fieldsSerialized() {
    return ModelBase.stringify(this.fields())
  }

  static fieldsBare() {
    return this.fieldsSerialized()
      .replace('[', '')
      .replace(']', '')
  }

  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  static stringify(object: any) {
    if (Array.isArray(object)) {
      return JSON.stringify(object).replace(/"/g, '')
    }
    if (typeof object !== 'object') {
      return JSON.stringify(object)
    }
    if (object == null) {
      return 'null'
    }
    let props = Object.keys(object)
      .map(key => `${key}:${this.stringify(object[key])}`)
      .join(',')
    return `{${props}}`
  }
}
