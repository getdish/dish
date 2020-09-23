import { CITY_LIST } from '../utils'
import { Self } from './Self'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const internal = new Self()
  for (const city of cities) {
    internal.addBigJob('allForCity', [city])
  }
})()
