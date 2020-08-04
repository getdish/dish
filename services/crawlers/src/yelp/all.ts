import { CITY_LIST } from '../utils'
import { Yelp } from './Yelp'
;(async () => {
  const y = new Yelp()
  for (const city of CITY_LIST) {
    y.runOnWorker('allForCity', [city])
  }
})()
