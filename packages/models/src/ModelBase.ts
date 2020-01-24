import axios, { AxiosRequestConfig } from 'axios'

type Point = {
  type: string
  coordinates: [number, number]
}

// For dynamically creating types so we can introspect keys.
// Essentially allows us to only define our model keys once.
type MapSchemaTypes = {
  string: string
  integer: number
  boolean: boolean
  float: number
  number: number
  point: Point
  regexp: RegExp
  // TODO: Add more as you need
}
export type MapSchema<T extends Record<string, keyof MapSchemaTypes>> = {
  // TODO: Add optional types
  [K in keyof T]: MapSchemaTypes[T[K]]
}

const LOCAL_HASURA = 'http://localhost:8080'
let DOMAIN: string

if (typeof window == 'undefined') {
  DOMAIN = process.env.HASURA_ENDPOINT || LOCAL_HASURA
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

export class ModelBase {
  schema: {}

  constructor(fields_schema: {}) {
    this.schema = fields_schema
  }

  async hasura(gql: string) {
    let conf = AXIOS_CONF
    conf.data.query = gql
    const response = await axios(conf)
    if (response.data.errors) {
      console.error(gql)
      throw response.data.errors
    }
    return response
  }

  static asSchema<T extends Record<string, keyof MapSchemaTypes>>(t: T): T {
    return t
  }

  fields() {
    return this.stringify(Object.keys(this.schema))
  }

  fields_bare() {
    return this.fields()
      .replace('[', '')
      .replace(']', '')
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
    if (object == null) {
      return 'null'
    }
    let props = Object.keys(object)
      .map(key => `${key}:${this.stringify(object[key])}`)
      .join(',')
    return `{${props}}`
  }
}
