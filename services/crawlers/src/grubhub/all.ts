import { GrubHub } from './GrubHub'
;(async () => {
  const gh = new GrubHub()
  await gh.runOnWorker('allForCity', ['San Francisco, CA'])
})()
