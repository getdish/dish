import { ZeroUUID, restaurantFindOne, restaurantInsert } from '@dish/graph'

import { GoogleGeocoder } from './google/GoogleGeocoder'
import { scrapeFindOneBySourceID } from './scrape-helpers'

export async function restaurantSaveCanonical(
  source: string,
  id_from_source: string,
  lon: number,
  lat: number,
  name: string,
  address: string
) {
  const found = await findExistingCanonical(source, id_from_source, lon, lat, name, address)
  if (found) {
    return found
  }
  const [restaurant] = await restaurantInsert([
    {
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    },
  ])
  if (process.env.RUN_WITHOUT_WORKER != 'true') {
    console.log('Created new canonical restaurant: ' + restaurant.id)
  }
  return restaurant.id
}

async function findExistingCanonical(
  source: string,
  id_from_source: string,
  lon: number,
  lat: number,
  name: string,
  address: string
): Promise<string | undefined> {
  const scrape = await scrapeFindOneBySourceID(source, id_from_source, true)
  if (scrape && scrape.restaurant_id !== ZeroUUID) {
    return scrape.restaurant_id
  }
  const restaurant = await restaurantFindOne({ address, name })
  if (restaurant) {
    console.log('found existing exact name + address match')
    return restaurant.id
  }
  console.log('findExistingCanonical, no scrape, geocoding...')
  const geocoder = new GoogleGeocoder()
  const query = name + ', ' + address
  const google_id = await geocoder.searchForID(query, lat, lon)
  if (google_id) {
    const restaurant = await restaurantFindOne({ geocoder_id: google_id })
    if (restaurant) {
      console.log('found google restaurant', restaurant.id)
      return restaurant.id
    }
  } else {
    console.error(`No google id ${query} ${lat} ${lon}`)
  }
}
