import { restaurantFindOne } from '@dish/graph'

import { GoogleGeocoder } from '../GoogleGeocoder'
import { GooglePuppeteer } from './GooglePuppeteer'
import { GoogleReviewAPI } from './GoogleReviewAPI'

//const name = 'Kokkari Estiatorio'
const name = 'Haseki Ev Yemekleri'

async function one_puppeteer() {
  const restaurant = await restaurantFindOne({ name })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new GooglePuppeteer()
  console.log(
    'Restaurant from DB being used for Google crawl: ' + restaurant.name
  )
  await google.getRestaurant(restaurant)
}

async function geocoder() {
  const restaurant = await restaurantFindOne({ name })
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

async function one_review_api() {
  const restaurant = await restaurantFindOne({ name })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new GoogleReviewAPI()
  console.log(
    'Restaurant from DB being used for Google crawl: ' + restaurant.name
  )
  await google.getRestaurant(restaurant.id)
}

//one()
//geocoder()
one_review_api()
