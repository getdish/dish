import { getCities } from '../utils'
import { Yelp } from './Yelp'

const y = new Yelp()
for (const city of getCities()) {
  y.runOnWorker('allForCity', [city])
}
