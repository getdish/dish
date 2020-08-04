import { CITY_LIST } from '../utils'
import { GrubHub } from './GrubHub'
;(async () => {
  const gh = new GrubHub()
  for (const city of CITY_LIST) {
    gh.runOnWorker('allForCity', [city])
  }
})()
