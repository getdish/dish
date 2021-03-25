import { restaurantFindOne } from '@dish/graph'

import { GoogleGeocoder } from './GoogleGeocoder'
import { GooglePuppeteer } from './GooglePuppeteer'
import { GoogleReviewAPI } from './GoogleReviewAPI'

async function one_puppeteer(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new GooglePuppeteer()
  console.log('Restaurant from DB being used for Google crawl: ' + restaurant.name)
  await google.getRestaurant(restaurant)
}

async function one_geocoder(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const geocoder = new GoogleGeocoder()
  const query = restaurant.name + ',' + restaurant?.address
  const id = await geocoder.searchForID(
    query,
    restaurant.location.coordinates[1],
    restaurant.location.coordinates[0]
  )
  console.log(id)
}

async function one_review_api(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new GoogleReviewAPI()
  console.log('Restaurant from DB being used for Google crawl: ' + restaurant.name)
  await google.getRestaurant(restaurant.id)
}

export async function one(slug: string) {
  await one_geocoder(slug)
  await one_review_api(slug)
  await one_puppeteer(slug)
}

if (process.env.RUN && process.env.SLUG) {
  one(process.env.SLUG)
}
