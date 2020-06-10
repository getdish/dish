import { Yelp } from './Yelp'
;(async () => {
  const y = new Yelp()
  await y.runOnWorker('allForCity', ['San Francisco, CA'])
})()
