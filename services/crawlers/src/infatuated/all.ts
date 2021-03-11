import { getCities } from '../utils'
import { Infatuated } from './Infatuated'

const i = new Infatuated()
for (const city of getCities()) {
  i.runOnWorker('allForCity', [city])
}
