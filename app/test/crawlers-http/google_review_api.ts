import { restaurantFindOne } from '@dish/graph'
import test from 'ava'

import { GoogleReviewAPI } from '../../src/google/GoogleReviewAPI'
import { deleteAllScrapesBySourceID, scrapeFindOneBySourceID } from '../../src/scrape-helpers'
import { tripadvisorGetFBC } from '../../src/tripadvisor/Tripadvisor'

const name = 'Fresh Brew Coffee'

const ID = '0x8085808d932ad877:0x6b0a1f17813a870d'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

// Skipped temporarily whilst we top up the Luminati account
test('Gets and persists a restaurant', async (t) => {
  let restaurant = await restaurantFindOne({ name })
  if (!restaurant) {
    await tripadvisorGetFBC()
    restaurant = await restaurantFindOne({ name })
  }
  t.assert(restaurant)
  if (!restaurant) throw new Error('No restaurant in google_review_api test')
  const gra = new GoogleReviewAPI()
  const is_found = await gra.getRestaurant(restaurant.id)
  if (!is_found) {
    throw new Error("GoogleReviewAPI couldn't find restaurant")
  }
  const scrape = await scrapeFindOneBySourceID('google_review_api', ID)
  t.assert(scrape)
  if (!scrape) throw new Error('No scrape')
  // console.log('google_review scrape.data', scrape.data)
  const review = scrape.data.reviews[0]
  t.assert(review.name != '')
  t.assert(review.user_id != '')
  t.assert(review.ago_text != '')
  t.assert(review.rating != '')
})
