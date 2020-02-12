import { ModelBase, Point } from './ModelBase'

export type ScrapeData = { [key: string]: any }

export class Scrape extends ModelBase<Scrape> {
  source!: string
  id_from_source!: string
  data!: ScrapeData
  location!: Point

  constructor(init?: Partial<Scrape>) {
    super()
    Object.assign(this, init)
  }

  static model_name() {
    return 'Scrape'
  }

  static fields() {
    return ['source', 'id_from_source', 'data', 'location']
  }

  static async mergeData(id: string, data: ScrapeData) {
    const scrape = new Scrape()
    await scrape.findOne('id', id)
    await scrape.appendJsonB(data)
    return scrape
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
