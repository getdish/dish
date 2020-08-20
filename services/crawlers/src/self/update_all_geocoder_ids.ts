import { Self } from './Self'
;(async () => {
  const internal = new Self()
  internal.addBigJob('updateAllGeocoderIDs', [])
})()
