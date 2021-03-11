import { getCities } from '../utils'
import { Tripadvisor } from './Tripadvisor'

const t = new Tripadvisor()
for (const city of getCities()) {
  t.runOnWorker('allForCity', [city])
}
