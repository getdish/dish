import { CITY_LIST } from '../utils'
import { DoorDash } from './DoorDash'
;(async () => {
  const dd = new DoorDash()
  for (const city of CITY_LIST) {
    dd.runOnWorker('allForCity', [city])
  }
})()
