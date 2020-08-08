import { CITY_LIST } from '../utils'
import { Google } from './Google'
;(async () => {
  const google = new Google()
  await google.boot()
  for (const city of CITY_LIST) {
    google.runOnWorker('allForCity', [city])
  }
})()
