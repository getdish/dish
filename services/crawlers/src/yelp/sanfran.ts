import { Yelp } from './Yelp'

async function main() {
  const ue = new Yelp()
  await ue.runOnWorker('allForCity', ['San Francisco, CA'])
}

main()
