import { restaurantFindOne } from '@dish/graph'

import { GoogleGeocoder } from '../GoogleGeocoder'
import { Google } from './Google'

const name = 'Kokkari Estiatorio'

async function one() {
  const restaurant = await restaurantFindOne({ name })
  if (!restaurant) throw new Error('Google sandbox: could not find ' + name)
  const google = new Google()
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

//one()
geocoder()
