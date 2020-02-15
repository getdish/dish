import { Yelp } from './Yelp'

async function main() {
  const ue = new Yelp()
  const week = 1000 * 60 * 60 * 24 * 7
  await ue.runOnWorker('allForCity', ['San Francisco, CA'], {
    repeat: { every: week },
    jobId: 'YELP SAN FRANCISCO CRAWLER',
  })
}

main()
