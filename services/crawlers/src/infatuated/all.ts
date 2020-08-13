import { CITY_LIST } from '../utils'
import { Infatuated } from './Infatuated'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const i = new Infatuated()
  for (const city of cities) {
    i.runOnWorker('allForCity', [city])
  }
})()
