import { CITY_LIST } from '../utils'
import { DoorDash } from './DoorDash'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const dd = new DoorDash()
  for (const city of cities) {
    dd.runOnWorker('allForCity', [city])
  }
})()
