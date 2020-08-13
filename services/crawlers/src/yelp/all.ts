import { CITY_LIST } from '../utils'
import { Yelp } from './Yelp'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const y = new Yelp()
  for (const city of cities) {
    y.runOnWorker('allForCity', [city])
  }
})()
