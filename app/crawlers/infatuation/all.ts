import { getCities } from '../utils'
import { Infatuation } from './Infatuation'

const i = new Infatuation()
for (const city of getCities()) {
  i.runOnWorker('allForCity', [city])
}
