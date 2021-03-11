import { getCities } from '../utils'
import { UberEats } from './UberEats'

const u = new UberEats()
for (const city of getCities()) {
  u.runOnWorker('getCity', [city])
}
