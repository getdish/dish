import { RestaurantWithId, ZeroUUID, restaurantFindOne, restaurantInsert } from '@dish/graph'

import { GoogleGeocoder } from './google/GoogleGeocoder'
import { scrapeFindOneBySourceID } from './scrape-helpers'

/**
 * On the logic of persisting the geocoder_id at this point rather than in a `BigJob`:
 *
 * There already existed a logic of adding the geocoder_ids in bulk through a worker job. But
 * after being away from the code for 6 months I was suddenly struck by the oddity of that approach.
 * It seems much more natural to be persisting the geocoder_id at the point when a canonical
 * restaurant is first created. There may be some non-obvious gotcha to this seemingly more intuitive
 * approach, so for now I will leave the `updateAllGeocoderIDs`` code.
 */

export async function restaurantSaveCanonical(
  source: string,
  id_from_source: string,
  lon: number,
  lat: number,
  name: string,
  address: string
) {
  const [restaurant_id, geocoder_id] = await findExistingCanonical(
    source,
    id_from_source,
    lon,
    lat,
    name,
    address
  )
  if (restaurant_id) {
    return restaurant_id
  }
  const [restaurant] = await restaurantInsert([
    {
      name,
      address,
      location: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      geocoder_id,
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
): Promise<[string | undefined, string | undefined]> {
  const scrape = await scrapeFindOneBySourceID(source, id_from_source, true)
  let restaurant: RestaurantWithId | null
  if (scrape && scrape.restaurant_id !== ZeroUUID) {
    restaurant = await restaurantFindOne({ id: scrape.restaurant_id })
    if (restaurant && restaurant.geocoder_id) {
      return [restaurant.id, undefined]
    }
  }
  console.log('findExistingCanonical, no existing scrape or restaurant, geocoding...')
  const geocoder = new GoogleGeocoder()
  const query = name + ', ' + address
  const google_id = await geocoder.searchForID(query, lat, lon)
  if (!google_id) {
    throw new Error(`No google id ${query} ${lat} ${lon} for ${name}, ${address}`)
  }
  restaurant = await restaurantFindOne({ geocoder_id: google_id })
  if (restaurant) {
    console.log('found restaurant via geocoder_id', restaurant.id)
    return [restaurant.id, undefined]
  } else {
    console.log('first ever scrape of ', name)
    return [undefined, google_id]
  }
}
