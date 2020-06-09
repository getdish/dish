import { Google } from './google/Google'
import { Infatuated } from './infatuated/Infatuated'
import { Michelin } from './michelin/Michelin'
import { Self } from './self/Self'
import { Tripadvisor } from './tripadvisor/Tripadvisor'
import { UberEats } from './ubereats/UberEats'
import { Yelp } from './yelp/Yelp'

async function main() {
  const dish = new Self()
  const yelp = new Yelp()
  const ue = new UberEats()
  const inf = new Infatuated()
  const michelin = new Michelin()
  const tripadvisor = new Tripadvisor()
  const google = new Google()
  const day = 1000 * 60 * 60 * 24
  const week = day * 7

  await yelp.runOnWorker('allForCity', ['San Francisco, CA'], {
    repeat: { every: week },
    jobId: 'YELP SAN FRANCISCO CRAWLER',
  })

  await inf.runOnWorker('allForCity', ['San Francisco, CA'], {
    repeat: { every: week },
    jobId: 'INFATUATED SAN FRANCISCO CRAWLER',
  })

  await michelin.runOnWorker('allForRegion', ['california'], {
    repeat: { every: week },
    jobId: 'MICHELIN CALIFORNIA CRAWLER',
  })

  await tripadvisor.runOnWorker('allForCity', ['San Francisco, CA'], {
    repeat: { every: week },
    jobId: 'TRIPADVISOR SANFRANCISCO CRAWLER',
  })

  await ue.runOnWorker('world', undefined, {
    repeat: { every: 4 * week },
    jobId: 'UBEREATS WORLD CRAWLER',
  })

  await google.runOnWorker('main', undefined, {
    repeat: { every: week },
    jobId: 'GOOGLE SANFRANCISCO CRAWLER',
  })

  await dish.runOnWorker('main', undefined, {
    repeat: { every: day },
    jobId: 'DAILY INTERNAL DATA MERGER',
  })
}

//main()

// So we can `kubectl exec` in on occasion
setInterval(() => {}, 2 ^ 30)
