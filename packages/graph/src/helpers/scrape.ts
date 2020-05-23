import { mutation } from '../graphql/mutation'
import { Scrape, ScrapeWithId } from '../types'
import { findOne, insert, update } from './queryHelpers'
import { resolvedMutationWithFields } from './queryResolvers'

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
): Promise<Scrape | null> {
  const scrape = await scrapeFindOne({ id })
  // TODO: Have scrapeAppendJsonB() return the actual DB record
  if (scrape) {
    await scrapeAppendJsonB(scrape, data)
    Object.assign(scrape.data, data)
    return scrape
  }
  return null
}

export async function scrapeAppendJsonB(
  scrape: Scrape,
  data: {}
): Promise<Scrape[] | null> {
  return await resolvedMutationWithFields(() => {
    return mutation.update_scrape({
      where: { id: { _eq: scrape.id } },
      _append: { data: data },
    })
  })
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
