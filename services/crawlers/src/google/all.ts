import { CITY_LIST } from '../utils'
import { GoogleReviewAPI } from './GoogleReviewAPI'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const google = new GoogleReviewAPI()
  for (const city of cities) {
    google.runOnWorker('allForCity', [city])
  }
})()
