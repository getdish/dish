import { resolved } from 'gqless'

import { mutation } from '../graphql/mutation'
import { Scrape, ScrapeWithId } from '../types'
import { findOne, insert, update, upsert } from './queryHelpers'

export type ScrapeData = { [key: string]: any }

export async function scrapeInsert(scrapes: Scrape[]) {
  return await insert<Scrape>('scrape', scrapes)
}

// export async function scrapeUpsert(objects: Scrape[]) {
//   return await upsert<Scrape>('scrape', '', objects)
// }

export async function scrapeUpdate(scrape: ScrapeWithId) {
  return await update<ScrapeWithId>('scrape', scrape)
}

export async function scrapeFindOne(scrape: Partial<Scrape>) {
  return await findOne<ScrapeWithId>('scrape', scrape)
}

export async function scrapeMergeData(
  id: string,
  data: ScrapeData
): Promise<Scrape> {
  const scrape = await scrapeFindOne({ id })
  // TODO: Have scrapeAppendJsonB() return the actual DB record
  await scrapeAppendJsonB(scrape, data)
  Object.assign(scrape.data, data)
  return scrape
}

export async function scrapeAppendJsonB(scrape: Scrape, data: {}) {
  const [response] = (await resolved(() => {
    const _response = mutation.update_scrape({
      where: { id: { _eq: scrape.id } },
      _append: { data: data },
    })
    // TODO: why does this prevent the mutation from being called??
    // It is better to get the database to tell us exactly what the new record
    // is rather than appending the new data ourselves and hoping for the best.
    //if (_response.returning.length > 0) {
    //_response.returning[0].data
    //}
    return _response.returning
  })) as Scrape[]
  return response
}

export function scrapeGetData(
  scrape: Scrape,
  path: string,
  default_value: any = ''
): any {
  let obj = scrape.data
  const keys = path.split('.')
  const length = keys.length
  let index = -1
  if (typeof obj === 'undefined') {
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
      if (obj === null) {
        return default_value
      }
      if (index >= 0) {
        obj = obj[index]
      }
      if (typeof obj === 'undefined') {
        return default_value
      }
    } else {
      return default_value
    }
  }
  return obj
}
