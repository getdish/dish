import { restaurantFindOne } from '@dish/graph'

import { Tripadvisor } from './Tripadvisor'

export async function one(slug: string) {
  const r = await restaurantFindOne({ slug })
  if (!r) {
    throw new Error(`No restaurant with slug ${slug}`)
  }
  const turl = r.sources?.tripadvisor?.url
  if (!turl) {
    throw new Error(`No tripadvisor url stored ${JSON.stringify(r || null)}`)
  }
  const tpath = turl.replace('https://www.tripadvisor.com', '')
  const t = new Tripadvisor()
  await t.runOnWorker('getRestaurant', [tpath])
}

if (process.env.RUN && process.env.SLUG) {
  one(process.env.SLUG)
}
