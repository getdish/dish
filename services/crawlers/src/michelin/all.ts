import { Michelin } from './Michelin'
;(async () => {
  const m = new Michelin()
  m.runOnWorker('allForRegion', ['california'])
})()
