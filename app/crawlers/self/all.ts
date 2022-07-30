import { getCities } from '../utils'
import { Self } from './Self'

const internal = new Self()
for (const city of getCities()) {
  internal.addBigJob('allForCity', [city])
}
