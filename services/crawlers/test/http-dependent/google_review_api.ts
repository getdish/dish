import { restaurantFindOne } from '@dish/graph'
import test from 'ava'

import { GoogleReviewAPI } from '../../src/google/GoogleReviewAPI'
import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'
import { tripadvisorGetFBC } from '../../src/utils'

const name = 'Fresh Brew Coffee'

const ID = '0x8085808d932ad877:0x6b0a1f17813a870d'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

test('Gets and persists a restaurant', async (t) => {
  let restaurant = await restaurantFindOne({ name })
  if (!restaurant) {
    await tripadvisorGetFBC()
    restaurant = await restaurantFindOne({ name })
  }
  t.assert(restaurant)
  if (!restaurant) throw 'No restaurant in google_review_api test'
  const gra = new GoogleReviewAPI()
  await gra.getRestaurant(restaurant.id)
  const scrape = await scrapeFindOneBySourceID('google_review_api', ID)
  t.assert(scrape)
  if (!scrape) throw 'No scrape'
  const review = scrape.data.reviews[0]
  t.assert(review.name != '')
  t.assert(review.user_id != '')
  t.assert(review.ago_text != '')
  t.assert(review.rating != '')
})
