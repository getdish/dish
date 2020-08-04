import { CITY_LIST } from '../utils'
import { Infatuated } from './Infatuated'
;(async () => {
  const i = new Infatuated()
  for (const city of CITY_LIST) {
    i.runOnWorker('allForCity', [city])
  }
})()
