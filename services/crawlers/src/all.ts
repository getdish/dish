import { Yelp } from './yelp/Yelp'
import { UberEats } from './ubereats/UberEats'

async function main() {
  const yelp = new Yelp()
  yelp.runOnWorker('allForCity', ['San Francisco, CA'])
  const ue = new UberEats()
  ue.runOnWorker('world')
}

main()
