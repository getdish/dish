import { getCities } from '../utils'
import { GoogleReviewAPI } from './GoogleReviewAPI'

const google = new GoogleReviewAPI()
for (const city of getCities()) {
  google.runOnWorker('allForCity', [city])
}
