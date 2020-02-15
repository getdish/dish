import { ModelBase, Point } from './ModelBase'

export type ScrapeData = { [key: string]: any }

export class Scrape extends ModelBase<Scrape> {
  source!: string
  id_from_source!: string
  data!: ScrapeData
  location!: Point
  restaurant_id!: string

  constructor(init?: Partial<Scrape>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'Scrape'
  }

  static fields() {
    return ['source', 'id_from_source', 'data', 'location', 'restaurant_id']
  }

  static async mergeData(id: string, data: ScrapeData) {
    const scrape = new Scrape()
    await scrape.findOne('id', id)
    await scrape.appendJsonB(data)
    return scrape
  }

  getData(path: string, default_value: any = '') {
    let obj = this.data
    const keys = path.split('.')
    const length = keys.length
    let index = -1
    if (typeof obj == 'undefined') {
      return default_value
    }
    for (let i = 0; i < length; i++) {
      let key = keys[i]
      const matches = key.match(/\[(.*)\]/)
      if (matches) {
        key = key.split('[')[0]
        index = parseFloat(matches[0][1])
      } else {
        index = -1
      }
      if (key in obj) {
        obj = obj[key]
        if (index >= 0) {
          obj = obj[index]
        }
        if (typeof obj == 'undefined') {
          return default_value
        }
      } else {
        return default_value
      }
    }
    return obj
  }

  async appendJsonB(data: {}) {
    const query = {
      mutation: {
        update_scrape: {
          __args: {
            where: { id: { _eq: this.id } },
            _append: { data: data },
          },
          returning: {
            data: true,
          },
        },
      },
    }
    const response = await ModelBase.hasura(query)
    Object.assign(this, response.data.data.update_scrape.returning[0])
    return this.id
  }
}
