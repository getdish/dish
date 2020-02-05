import { ModelBase } from './ModelBase'

type ScrapeData = { [key: string]: any }

export class Scrape extends ModelBase<Scrape> {
  source!: string
  id_from_source!: string
  data!: ScrapeData

  constructor(init?: Partial<Scrape>) {
    super()
    Object.assign(this, init)
  }

  static fields() {
    return ['source', 'id_from_source', 'data']
  }

  static async mergeData(id: string, data: ScrapeData) {
    const scrape = new Scrape()
    await scrape.findOne('id', id)
    Object.assign(scrape.data, data)
    scrape.update()
    return scrape
  }

  static async deleteBySourceId(id_from_source: string) {
    const query = `mutation {
      delete_scrape(where: {id_from_source: {_eq: "${id_from_source}"}}) {
        returning { id }
      }
    }`
    return await ModelBase.hasura(query)
  }
}
