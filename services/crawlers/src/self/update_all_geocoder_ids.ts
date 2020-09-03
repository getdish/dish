import { Restaurant, globalTagId } from '@dish/graph'

import { GoogleGeocoder } from '../GoogleGeocoder'
import {
  getTableCount,
  googlePermalink,
  restaurantDeleteOrUpdateByGeocoderID,
  restaurantFindBasicBatchForAll,
} from '../utils'
import { Self } from './Self'

export async function updateAllRestaurantGeocoderIDs(internal: Self) {
  let previous_id = globalTagId
  let arrived = process.env.START_FROM ? false : true
  let progress = 0
  let page = 0
  const PER_PAGE = 1000
  const count = await getTableCount('restaurant', 'WHERE geocoder_id IS NULL')
  console.log('Total restaurants without geocoder_ids: ' + count)
  while (true) {
    const results = await restaurantFindBasicBatchForAll(
      PER_PAGE,
      previous_id,
      'AND geocoder_id IS NULL'
    )
    if (results.length == 0) {
      await internal.job.progress(100)
      break
    }
    for (const result of results) {
      if (!arrived) {
        if (result.id != process.env.START_FROM) {
          console.log('Skipping: ' + result.name)
          continue
        } else {
          arrived = true
        }
      }
      const restaurant_data = {
        id: result.id,
        name: result.name,
        address: result.address,
        location: JSON.parse(result.location),
      }
      await internal.runOnWorker('updateGeocoderID', [restaurant_data])
      previous_id = result.id as string
    }
    page += 1
    progress = ((page * PER_PAGE) / count) * 100
    if (process.env.RUN_WITHOUT_WORKER != 'true') {
      await internal.job.progress(progress)
    } else {
      console.log('Progress: ' + progress)
    }
  }
}

export async function updateGeocoderID(restaurant: Restaurant) {
  console.log(
    'UPDATE GEOCODER IDS: ',
    restaurant.id,
    `"${restaurant.name}"`,
    restaurant.address,
    restaurant.location
  )
  if (!restaurant.name) {
    console.log('Bad restaurant: ', restaurant)
    return false
  }
  const geocoder = new GoogleGeocoder()
  const coords = restaurant.location
  const lon = coords.coordinates[0]
  const lat = coords.coordinates[1]
  const query = restaurant.name + ',' + restaurant.address
  const google_id = await geocoder.searchForID(query, lat, lon)
  if (google_id) {
    const permalink = googlePermalink(google_id, lat, lon)
    restaurant.geocoder_id = google_id
    await restaurantDeleteOrUpdateByGeocoderID(restaurant.id, google_id)
    console.log('GEOCODER RESULT: ', `"${restaurant.name}"`, permalink)
  }
}

if (require.main === module) {
  ;(async () => {
    const internal = new Self()
    //await internal.addBigJob('updateAllRestaurantGeocoderIDs', [])
    await internal.addBigJob('updateAllDistinctScrapeGeocoderIDs', [])
  })()
}
