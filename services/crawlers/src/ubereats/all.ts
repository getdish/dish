import { CITY_LIST } from '../utils'
import { UberEats } from './UberEats'
;(async () => {
  const u = new UberEats()
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  for (const city of cities) {
    u.runOnWorker('getCity', [city])
  }
})()
