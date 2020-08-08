import { CITY_LIST } from '../utils'
import { Self } from './Self'
;(async () => {
  const internal = new Self()
  for (const city of CITY_LIST) {
    await internal.runOnWorker('allForCity', [city])
  }
})()
