import { getCities } from '../utils'
import { DoorDash } from './DoorDash'

const dd = new DoorDash()
for (const city of getCities()) {
  dd.runOnWorker('allForCity', [city])
}
