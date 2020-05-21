import { restaurantFindOne } from '@dish/graph'

import { Google } from './Google'

const name = 'Fresh Brew Coffee'

async function one() {
  const restaurant = await restaurantFindOne({ name })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new Google()
  await google.boot()
  console.log(
    'Restaurant from DB being used for Google crawl: ' + restaurant.name
  )
  await google.getRestaurant(restaurant)
}

async function all() {
  const google = new Google()
  await google.main()
}

one()
