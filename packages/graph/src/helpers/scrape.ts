import { Point, resolved } from '@dish/graph'

import { mutation } from '../graphql/mutation'
import { Scrape } from '../types'
import { findOne } from './queryHelpers'

export type ScrapeData = { [key: string]: any }

// ['source', 'id_from_source', 'data', 'location', 'restaurant_id']

export async function scrapeMergeData(id: string, data: ScrapeData) {
  const scrape = await findOne<Scrape>('scrape', { id })
  await scrapeAppendJsonB(scrape, data)
  return
}

export async function scrapeAppendJsonB(scrape: Scrape, data: {}) {
  const [response] = await resolved(() => {
    return mutation.update_scrape?.({
      where: { id: { _eq: scrape.id } },
      _append: { data: data },
    }).returning
  })
  Object.assign(scrape, response)
  return scrape.id
}

export function scrapeGetData(
  scrape: Scrape,
  path: string,
  default_value: any = ''
) {
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
