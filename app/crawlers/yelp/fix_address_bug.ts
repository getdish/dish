import { restaurantInsert } from '@dish/graph'
import { scrape_db } from '@dish/helpers-node'

import { geocodeRestaurant } from '../canonical-restaurant'
import { scrapeFindOneByUUID } from '../scrape-helpers'
import { Yelp, YelpScrape } from './Yelp'

// The bug itself was just that the address field we'd chosen was unreliable.
// This meant that we couldn't guarantee that all Yelp scrapes had found their
// correct canonical restaurant (the address can often be critical in
// geocoding). Fixing the underlying bug itself was easy, but fixing the
// affected data is a little bit harder, hence the code here...

// I ran: `
//   UPDATE scrape
//   SET data = data || '{"is_geocoder_bug_fixed": false}'
//   WHERE source = 'yelp'
// `
// in order to keep track of which ones had been fixed

export class FixAddressBug {
  static run() {
    const yelp = new Yelp()
    yelp.addBigJob('_reGeocodeScrapes', [])
  }

  static async reGeocodeScrapes(yelp: Yelp) {
    const query = `
      SELECT * FROM scrape
        WHERE data->>'is_geocoder_bug_fixed' = 'false'
        AND source = 'yelp'
    `
    console.log('Querying offending scrapes...')
    const results = await scrape_db.query(query)
    for (const row of results.rows) {
      await yelp.runOnWorker('_reGeocodeOneScrape', [row.id])
    }
    process.exit(0)
  }

  static async reGeocodeOneScrape(id: string) {
    let query: string
    const scrape = await scrapeFindOneByUUID(id)
    let restaurant_id: string
    // @ts-ignore
    if (scrape.is_geocoder_bug_fixed) {
      console.log('Skipping already-fixed scrape: ' + scrape.id)
      return
    }
    if (!scrape.data.json) {
      console.warn('Yelp scrape without its `json` field, deleting: ' + scrape.id)
      await FixAddressBug.deleteScrape(scrape.id)
      return
    }
    console.log('Checking for bugged scrape: ' + scrape.id)
    const deets = Yelp.getNameAndAddress(scrape as YelpScrape)
    let [restaurant, geocoder_id] = await geocodeRestaurant(
      deets.name,
      deets.address,
      scrape.location.lat,
      scrape.location.lon
    )
    if (!restaurant) {
      console.warn('Creating restaurant for bugged scrape: ' + scrape.id)
      const data = {
        name: deets.name,
        address: deets.address,
        location: {
          type: 'Point',
          coordinates: [scrape.location.lon, scrape.location.lat],
        },
        geocoder_id,
      }
      const [_restaurant] = await restaurantInsert([data])
      restaurant = _restaurant
    }
    restaurant_id = restaurant.id
    if (restaurant_id != scrape.restaurant_id) {
      console.log('Fixing bugged scrape: ' + scrape.id)
      console.log(`Good restaurant: ${restaurant_id}. Bad restaurant: ${scrape.restaurant_id}`)
      query = `
      UPDATE scrape SET
        restaurant_id = '${restaurant.id}',
        data = data || '{"is_geocoder_bug_fixed": true}'
      WHERE id_from_source = '${scrape.id_from_source}'
    `
      await scrape_db.query(query)
      console.log(`Bugged scrape fixed (${deets.name}): ${scrape.id}`)
      // Delete incorrect restaurant???
    } else {
      console.log('Good scrape: ' + scrape.id)
      query = `
      UPDATE scrape SET
        data = data || '{"is_geocoder_bug_fixed": true}'
      WHERE id_from_source = '${scrape.id_from_source}'
    `
      await scrape_db.query(query)
    }
  }

  static async deleteScrape(id: string | undefined) {
    if (!id) {
      throw new Error('Scrape without an ID')
    }
    const query = `DELETE FROM scrape WHERE id = '${id}'`
    await scrape_db.query(query)
  }
}

if (require.main === module) {
  FixAddressBug.run()
}
