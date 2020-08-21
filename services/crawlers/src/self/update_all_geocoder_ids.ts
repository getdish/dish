import { Self } from './Self'
;(async () => {
  const internal = new Self()
  await internal.addBigJob('updateAllGeocoderIDs', [])
})()
