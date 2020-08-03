import { CITY_LIST } from '../utils'
import { Tripadvisor } from './Tripadvisor'
;(async () => {
  const t = new Tripadvisor()
  for (const city in CITY_LIST) {
    t.runOnWorker('allForCity', [city])
  }
})()
