import fs from 'fs'
import path from 'path'

import { restaurantFindOne } from '@dish/graph'
import test from 'ava'

import { Google } from '../../src/google/Google'
import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'
import { tripadvisorGetFBC } from '../../src/tripadvisor/Tripadvisor'

const name = 'Fresh Brew Coffee'

const ID = '0x8085808d932ad877:0x6b0a1f17813a870d'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

test.skip('Gets and persists a restaurant', async (t) => {
  let restaurant = await restaurantFindOne({ name })
  if (!restaurant) {
    await tripadvisorGetFBC()
    restaurant = await restaurantFindOne({ name })
  }
  t.assert(restaurant)
  if (!restaurant) return
  const google = new Google()
  await google.boot()
  await google.getRestaurant(restaurant)
  const scrape = await scrapeFindOneBySourceID('google', ID)
  t.assert(scrape)
  if (!scrape) return
  t.assert(
    scrape.data.synopsis.includes(
      'Snug cafe offering American & Vietnamese sandwiches'
    )
  )
  t.assert(scrape.data.hero_image.includes('googleusercontent.com'))
  t.assert(scrape.data.rating, '4.8')
  t.assert(scrape.data.hours[0].day, 'Friday')
  t.assert(scrape.data.hours[2].hours, 'Closed')
  t.assert(scrape.data.address.includes('882 Bush'))
  t.assert(scrape.data.website.includes('sites.tablehero.com'))
  t.assert(scrape.data.telephone.includes('(415) 567-0915'))
  t.assert(scrape.data.pricing, '$')
  t.assert(scrape.data.reviews.length > 10)
  t.assert(scrape.data.photos.length > 5)
  t.assert(scrape.data.photos[0].includes('googleusercontent.com'))
})

test('Converting table to JSON', (t) => {
  const html = fs.readFileSync(
    path.resolve(__dirname, './etc/google_hours_table.html'),
    { encoding: 'utf8' }
  )
  const json = Google.convertTableToJSON(html)
  t.deepEqual(json, [
    { day: 'Friday', hours: '7am–3pm' },
    { day: 'Saturday', hours: '7am–3pm' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Monday', hours: 'Closed' },
    { day: 'Tuesday', hours: '7am–3pm' },
    { day: 'Wednesday', hours: '7am–3pm' },
    { day: 'Thursday', hours: '7am–3pm' },
  ])
})
