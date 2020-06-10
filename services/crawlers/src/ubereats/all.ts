import { UberEats } from './UberEats'
;(async () => {
  const u = new UberEats()
  await u.runOnWorker('world')
})()
