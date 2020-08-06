import mapbox from 'mapbox-gl'

import { GeocodePlace, LngLat } from './home-types'

async function reverseGeocode(
  center: LngLat,
  requestLocation = false
): Promise<GeocodePlace[]> {
  console.warn('TODO reverseGeocode')
  return []
  // return await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/`)
  // const mapGeocoder = new mapkit.Geocoder({
  //   language: 'en-GB',
  //   getsUserLocation: requestLocation,
  // })
  // return new Promise((res, rej) => {
  //   mapGeocoder.reverseLookup(
  //     new mapkit.Coordinate(center.lat, center.lng),
  //     (err, data) => {
  //       if (err) return rej(err)
  //       res((data.results as any) as GeocodePlace[])
  //     }
  //   )
  // })
}
