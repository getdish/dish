import { Restaurant } from '@dish/models'

import { Google } from './Google'

const name = 'Fresh Brew Coffee'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', name)
  const google = new Google()
  await google.boot()
  const coords = restaurant.location.coordinates
  console.log(
    'Restaurant from DB being used for Google crawl: ' + restaurant.name
  )
  await google.getRestaurant(coords[0], coords[1], restaurant.name)
}

async function all() {
  const google = new Google()
  await google.main()
}

one()
