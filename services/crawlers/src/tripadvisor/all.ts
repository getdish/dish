import { CITY_LIST } from '../utils'
import { Tripadvisor } from './Tripadvisor'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const t = new Tripadvisor()
  for (const city of cities) {
    t.runOnWorker('allForCity', [city])
  }
})()
