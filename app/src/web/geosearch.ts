import { MapKit } from './MapKit'

const searcher = new MapKit.Search({
  language: 'en-US',
})

export async function geoSearch(params: { query: string; lng: number; lat: number }) {
  return await new Promise((res, rej) =>
    searcher.search(params.query, (err, data) => (err ? rej(err) : res(data)), {
      region: new MapKit.CoordinateRegion(new MapKit.Coordinate(params.lat, params.lng)),
    })
  )
}
