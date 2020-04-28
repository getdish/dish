import util from 'util'

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  split,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import auth from '@dish/auth'
import { getGraphEndpointDomain } from '@dish/common-web'
import axios, { AxiosRequestConfig } from 'axios'
import { EnumType, jsonToGraphQLQuery } from 'json-to-graphql-query'

export const isNode = typeof window == 'undefined'
export const isBrowserProd =
  !isNode && window.location.hostname.includes('dish')
let WebSocket: WebSocket

if (isNode) {
  require('isomorphic-fetch')
  WebSocket = require('ws')
} else {
  WebSocket = window['WebSocket'] as any
}

export type Point = {
  type: string
  coordinates: [number, number]
}

const DOMAIN = getGraphEndpointDomain()

let AXIOS_CONF = {
  url: DOMAIN + '/v1/graphql',
  method: 'POST',
  data: {
    query: '',
  },
} as AxiosRequestConfig

let apollo_client: ApolloClient<NormalizedCacheObject>

export function createApolloClient() {
  const httpLink = new HttpLink({
    uri: DOMAIN + '/v1/graphql',
    headers: auth.getHeaders(),
    fetch,
  })

  const hostname = new URL(DOMAIN).hostname
  let port = new URL(DOMAIN).port
  if (port != '') {
    port = ':' + port
  }
  let protocol = new URL(DOMAIN).protocol
  if (protocol == 'https:') {
    protocol = 'wss:'
  } else {
    protocol = 'ws:'
  }

  const wsLink = new WebSocketLink({
    uri: `${protocol}//${hostname + port}/v1/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        headers: auth.getHeaders(),
      },
    },
    webSocketImpl: WebSocket,
  })

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    // See this error:
    // https://github.com/apollographql/apollo-link/issues/538#issuecomment-571839546
    // @ts-ignore
    wsLink,
    httpLink
  )

  apollo_client = new ApolloClient({
    link: link,
    cache: new InMemoryCache({
      addTypename: true,
    }),
  })

  return apollo_client
}

export class ModelBase<T> {
  id!: string
  created_at!: Date
  updated_at!: Date
  private _klass: typeof ModelBase
  private _upper_name: string
  private _lower_name: string

  static default_fields() {
    if (isNode) {
      return ['id', 'created_at', 'updated_at']
    }
    return ['id']
  }

  static fields() {
    console.error('fields() not implemented')
    return ['']
  }

  static sub_fields(): { [key: string]: any } {
    return {}
  }

  static upper_name() {
    return this.model_name()
  }

  static lower_name() {
    return this.model_name().toLowerCase()
  }

  static upsert_constraint() {
    console.error('upsert_constraint() not implemented')
    return ''
  }

  constructor(init?: Partial<T>) {
    Object.assign(this, init)
    this._klass = this.constructor as typeof ModelBase
    this._upper_name = this._klass.upper_name()
    this._lower_name = this._upper_name.toLowerCase()
  }

  static model_name() {
    console.error('model_name() not implemented')
    return ''
  }

  static all_fields() {
    return this.default_fields()
      .concat(this.fields())
      .filter((f) => !this.write_only_fields().includes(f))
  }

  static read_only_fields() {
    return [] as string[]
  }

  static write_only_fields() {
    return [] as string[]
  }

  static updatableColumns() {
    return this.all_fields()
      .filter((f) => !this.read_only_fields().includes(f))
      .map((f) => new EnumType(f))
  }

  private static _fieldsAsObject(
    fields: string[],
    sub_fields: { [key: string]: string[] } = {}
  ) {
    let object = {}
    for (const key of fields) {
      if (!(key in sub_fields)) {
        object[key] = true
      } else {
        object[key] = sub_fields[key]
      }
    }
    return object
  }

  fieldsAsObject() {
    return ModelBase._fieldsAsObject(
      this._klass.all_fields(),
      this._klass.sub_fields()
    )
  }

  static fieldsAsObject(prevent_recursion: boolean = false) {
    let sub_fields = {} as { [key: string]: string[] }
    if (!prevent_recursion) sub_fields = this.sub_fields()
    return ModelBase._fieldsAsObject(this.all_fields(), sub_fields)
  }

  asObject() {
    let object = {}
    for (const field of this._klass.fields()) {
      if (field in this._klass.sub_fields()) {
        continue
      }
      if (this._klass.read_only_fields().includes(field)) {
        continue
      }
      if (field in this && this[field] != undefined) {
        object[field] = this[field]
      }
    }
    return object
  }

  static async query<T = any>(query: string): Promise<T> {
    const res = await apollo_client.query({
      query: gql`
        ${query}
      `,
    })
    return res.data
  }

  static async hasura(
    gql: {},
    silence_not_found: boolean = false
  ): Promise<any> {
    let conf = JSON.parse(JSON.stringify(AXIOS_CONF))
    gql = ModelBase.ensureKeySyntax(gql)
    conf.data.query = jsonToGraphQLQuery(gql, { pretty: true })
    conf.headers = auth.getHeaders()
    const response = await axios(conf)
    if (response.data.errors) {
      if (silence_not_found && response.status == 404) {
        return response
      } else {
        throw new HasuraError(conf.data.query, response.data.errors)
      }
    }
    return response
  }

  async refresh() {
    await this.findOneByHash({ id: this.id })
  }

  async insert() {
    const query = {
      mutation: {
        ['insert_' + this._lower_name]: {
          __args: {
            objects: this.asObject(),
          },
          affected_rows: true,
          returning: { id: true },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    Object.assign(
      this,
      response.data.data['insert_' + this._lower_name].returning[0]
    )
    return this.id
  }

  // TODO: should only update changed values
  async update() {
    const query = {
      mutation: {
        ['update_' + this._lower_name]: {
          __args: {
            where: { id: { _eq: this.id } },
            _set: this.asObject(),
          },
          affected_rows: true,
          returning: {
            id: true,
          },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    Object.assign(this, response.data.data[this._lower_name])
    return this.id
  }

  async findOne(key: string, value: string, extra_returning: {} = {}) {
    return await this.findOneByHash({ [key]: value }, extra_returning)
  }

  async findOneByHash(
    hash: { [key: string]: string },
    extra_returning: {} = {}
  ) {
    const where = Object.keys(hash).map((key) => {
      return { [key]: { _eq: hash[key] } }
    })
    const query = {
      query: {
        [this._lower_name]: {
          __args: {
            where: {
              _and: where,
            },
          },
          ...this.fieldsAsObject(),
          ...extra_returning,
        },
      },
    }
    const response = await ModelBase.hasura(query)
    const objects = response.data.data[this._lower_name]
    if (objects.length === 1) {
      Object.assign(this, objects[0])
      return this.id
    } else {
      const message =
        `${objects.length} ${this._lower_name}s found by findOne(). ` +
        `Using: ${JSON.stringify(hash)}`
      throw new Error(message)
    }
  }

  async fetchBatch(
    type: new () => T,
    size: number,
    previous_id: string,
    extra_returning: {} = {},
    extra_where: {} = {}
  ) {
    const query = {
      query: {
        [this._lower_name]: {
          __args: {
            limit: size,
            order_by: { id: new EnumType('asc') },
            where: {
              id: { _gt: previous_id },
              ...extra_where,
            },
          },
          id: true,
          ...extra_returning,
        },
      },
    }
    const response = await ModelBase.hasura(query)
    const objects = response.data.data[this._lower_name]
    const batch: T[] = []
    for (let object of objects) {
      let instance = new type()
      Object.assign(instance, object)
      batch.push(instance)
    }
    return batch
  }

  async upsert() {
    const query = {
      mutation: {
        ['insert_' + this._lower_name]: {
          __args: {
            objects: this.asObject(),
            on_conflict: {
              constraint: new EnumType(this._klass.upsert_constraint()),
              update_columns: this._klass
                .all_fields()
                .filter((f) => !this._klass.read_only_fields().includes(f))
                .map((f) => new EnumType(f)),
            },
          },
          affected_rows: true,
          returning: { id: true },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    let data = {}
    if (
      typeof response.data.data['insert_' + this._lower_name] != 'undefined'
    ) {
      data = response.data.data['insert_' + this._lower_name].returning[0]
    } else {
      data = response.data.data[this._lower_name][0]
    }
    Object.assign(this, data)
    return this.id
  }

  static async allCount() {
    const query = {
      query: {
        [this.lower_name() + '_aggregate']: {
          aggregate: {
            count: true,
          },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    return response.data.data[this.lower_name() + '_aggregate'].aggregate.count
  }

  static async deleteAllBy(key: string, value: string) {
    const query = {
      mutation: {
        ['delete_' + this.lower_name()]: {
          __args: {
            where: { [key]: { _eq: value } },
          },
          affected_rows: true,
        },
      },
    }
    return await ModelBase.hasura(query)
  }

  static async deleteAllFuzzyBy(key: string, value: string) {
    const query = {
      mutation: {
        ['delete_' + this.lower_name()]: {
          __args: {
            where: { [key]: { _ilike: `%${value}%` } },
          },
          affected_rows: true,
        },
      },
    }
    return await ModelBase.hasura(query)
  }

  private static ensureKeySyntax(query: {}) {
    ModelBase.traverse(query, (object, key, value) => {
      let fixed_key = key
      if (key.includes('-')) {
        fixed_key = '__HYPHEN__' + key.replace(/-/g, '_')
        object[fixed_key] = value
        delete object[key]
      }
    })
    return query
  }

  private static traverse(
    o: any,
    fn: (obj: any, prop: string, value: any) => void
  ) {
    for (const i in o) {
      if (o[i] !== null && typeof o[i] === 'object') {
        ModelBase.traverse(o[i], fn)
      }
      fn.apply(this, [o, i, o[i]])
    }
  }
}

class HasuraError extends Error {
  errors: {}
  constructor(query: string, errors: {} = {}) {
    super()
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HasuraError)
    }
    this.errors = errors
    this.message =
      errors[0]?.extensions?.internal?.error?.message || errors[0]?.message
    if (isBrowserProd) {
      this.name = 'Dish API Error'
    } else {
      console.error(util.inspect(errors, { depth: null }))
      console.debug('For query: ', query)
      this.name = 'HasuraError'
    }
  }
}
