import { restaurantFindOne } from '@dish/graph'

import { Google } from './Google'

const name = 'Cafe Coco'

async function one() {
  const restaurant = await restaurantFindOne({ name })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new Google()
  console.log(
    'Restaurant from DB being used for Google crawl: ' + restaurant.name
  )
  await google.getRestaurant(restaurant)
}

one()
