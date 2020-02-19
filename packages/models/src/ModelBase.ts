import axios, { AxiosRequestConfig } from 'axios'
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query'

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
    this._klass = this.constructor as typeof ModelBase
    this._upper_name = this._klass.upper_name()
    this._lower_name = this._upper_name.toLowerCase()
    Object.assign(this, init)
  }

  static model_name() {
    console.error('model_name() not implemented')
    return ''
  }

  static all_fields() {
    return this.default_fields().concat(this.fields())
  }

  private static _fieldsAsObject(fields: string[]) {
    let object = {}
    for (const key of fields) {
      object[key] = true
    }
    return object
  }

  fieldsAsObject() {
    return ModelBase._fieldsAsObject(this._klass.all_fields())
  }

  static fieldsAsObject() {
    return ModelBase._fieldsAsObject(this.all_fields())
  }

  asObject() {
    let object = {}
    for (const field of this._klass.fields()) {
      if (this[field]) {
        object[field] = this[field]
      }
    }
    return object
  }

  static async hasura(gql: {}) {
    let conf = JSON.parse(JSON.stringify(AXIOS_CONF))
    gql = ModelBase.ensureKeySyntax(gql)
    conf.data.query = jsonToGraphQLQuery(gql, { pretty: true })
    const response = await axios(conf)
    if (response.data.errors) {
      console.error(response.data.errors, conf.data.query)
      throw response.data.errors
    }
    return response
  }

  // TODO: only update provided fields
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
    const query = {
      query: {
        [this._lower_name]: {
          __args: {
            where: { [key]: { _eq: value } },
          },
          ...this.fieldsAsObject(),
          ...extra_returning,
        },
      },
    }
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
                .map(f => new EnumType(f)),
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
            where: { [key]: { _like: `%${value}%` } },
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
