import { Google } from './Google'
;(async () => {
  const google = new Google()
  await google.boot()
  await google.runOnWorker('main')
})()
