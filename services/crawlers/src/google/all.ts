import { Google } from './Google'
;(async () => {
  const google = new Google()
  await google.runOnWorker('main')
})()
