import { MapKit } from './MapKit'

const geocoder = new MapKit.Geocoder({
  language: 'en-US',
})

export async function reverseLookup(params: { lat: number; lng: number }) {
  return await new Promise((res, rej) =>
    geocoder.reverseLookup(new MapKit.Coordinate(params.lat, params.lng), (err, data) =>
      err ? rej(err) : res(data)
    )
  )
}
