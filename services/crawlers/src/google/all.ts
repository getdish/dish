import { CITY_LIST } from '../utils'
import { Google } from './Google'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const google = new Google()
  await google.boot()
  for (const city of cities) {
    google.runOnWorker('allForCity', [city])
  }
})()
