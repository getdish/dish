import { getCities } from '../utils'
import { GrubHub } from './GrubHub'

const gh = new GrubHub()
for (const city of getCities()) {
  gh.runOnWorker('allForCity', [city])
}
