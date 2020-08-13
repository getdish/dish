import { CITY_LIST } from '../utils'
import { GrubHub } from './GrubHub'
;(async () => {
  let cities = CITY_LIST
  if (process.env.CITY) {
    cities = [process.env.CITY]
  }
  const gh = new GrubHub()
  for (const city of cities) {
    gh.runOnWorker('allForCity', [city])
  }
})()
