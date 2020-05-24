import { scrape_constraint } from '../graphql'
import { mutation } from '../graphql/mutation'
import { Scrape } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedMutationWithFields } from './queryResolvers'

export type ScrapeData = { [key: string]: any }

const QueryHelpers = createQueryHelpersFor<Scrape>(
  'scrape',
  scrape_constraint.scrape_pkey
)
export const scrapeInsert = QueryHelpers.insert
export const scrapeUpsert = QueryHelpers.upsert
export const scrapeUpdate = QueryHelpers.update
export const scrapeFindOne = QueryHelpers.findOne
export const scrapeRefresh = QueryHelpers.refresh

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
  if (!scrape) return default_value
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
