import { DoorDash } from './DoorDash'
;(async () => {
  const dd = new DoorDash()
  await dd.runOnWorker('allForCity', ['San Francisco, CA'])
})()
