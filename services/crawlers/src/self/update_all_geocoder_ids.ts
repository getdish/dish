import { Self } from './Self'
;(async () => {
  const internal = new Self()
  //await internal.addBigJob('updateAllRestaurantGeocoderIDs', [])
  await internal.addBigJob('updateAllDistinctScrapeGeocoderIDs', [])
})()
