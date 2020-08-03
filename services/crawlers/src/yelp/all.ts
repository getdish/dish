import { CITY_LIST } from '../utils'
import { Yelp } from './Yelp'
;(async () => {
  const y = new Yelp()
  for (const city in CITY_LIST) {
    y.runOnWorker('allForCity', [city])
  }
})()
