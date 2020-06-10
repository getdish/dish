import { Tripadvisor } from './Tripadvisor'
;(async () => {
  const t = new Tripadvisor()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
})()
