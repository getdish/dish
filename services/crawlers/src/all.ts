import { Yelp } from './yelp/Yelp'
import { UberEats } from './ubereats/UberEats'
import { Self } from './self/Self'

async function main() {
  const yelp = new Yelp()
  const ue = new UberEats()
  const dish = new Self()
  const day = 1000 * 60 * 60 * 24
  const week = day * 7

  await yelp.runOnWorker('allForCity', ['San Francisco, CA'], {
    repeat: { every: week },
    jobId: 'YELP SAN FRANCISCO CRAWLER',
  })

  await ue.runOnWorker('world', undefined, {
    repeat: { every: week },
    jobId: 'UBEREATS WORLD CRAWLER',
  })

  await dish.runOnWorker('main', undefined, {
    repeat: { every: day },
    jobId: 'DAILY INTERNAL DATA MERGER',
  })
}

main()
