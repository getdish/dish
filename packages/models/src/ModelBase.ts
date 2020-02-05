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
    DOMAIN = process.env.REACT_APP_HASURA_ENDPOINT || LOCAL_HASURA
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
  private _klass: typeof ModelBase
  private _upper_name: string
  private _lower_name: string

  static default_fields() {
    return ['id', 'created_at', 'updated_at']
  }

  static fields() {
    console.error('fields() not implemented')
    return ['']
  }

  static upperName() {
    return this.constructor.name
  }

  static lowerName() {
    return this.constructor.name.toLowerCase()
  }

  constructor(init?: Partial<T>) {
    this._klass = this.constructor as typeof ModelBase
    this._upper_name = this._klass.name
    this._lower_name = this._upper_name.toLowerCase()
    Object.assign(this, init)
  }

  static all_fields() {
    return this.default_fields().concat(this.fields())
  }

  asObject() {
    let object = {}
    for (const field of this._klass.fields()) {
      object[field] = this[field]
    }
    return ModelBase.stringify(object)
  }

  static async hasura(gql: string) {
    let conf = AXIOS_CONF
    conf.data.query = gql
    const response = await axios(conf)
    if (response.data.errors) {
      console.error(response.data.errors, gql)
      throw response.data.errors
    }
    return response
  }

  static fieldsSerialized() {
    return ModelBase.stringify(this.all_fields())
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

  async insert() {
    const query = `mutation {
      insert_${this._lower_name}(
        objects: ${this.asObject()},
      ) {
        returning {
          ${this._klass.fieldsBare()}
        }
      }
    }`
    const response = await ModelBase.hasura(query)
    Object.assign(
      this,
      response.data.data['insert_' + this._lower_name].returning[0]
    )
    return this.id
  }

  async update() {
    const query = `mutation {
      update_${this._lower_name}(
        where: { id: { _eq: "${this.id}" } }
        _set: ${this.asObject()},
      ) {
        returning {
          ${this._klass.fieldsBare()}
        }
      }
    }`
    const response = await ModelBase.hasura(query)
    Object.assign(this, response.data.data[this._lower_name])
    return this.id
  }

  async findOne(key: string, value: string) {
    const query = `query {
      ${this._lower_name}(where: {${key}: {_eq: "${value}"}}) {
        id ${this._klass.fieldsBare()}
      }
    }`
    const response = await ModelBase.hasura(query)
    const objects = response.data.data[this._lower_name]
    if (objects.length == 1) {
      Object.assign(this, objects[0])
      return this.id
    } else {
      throw new Error(
        objects.length + ` ${this._lower_name}s found by findOne()`
      )
    }
  }
}
