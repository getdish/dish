export function shiftLatLonByMetres(
  lat: number,
  lon: number,
  diff_north: number,
  diff_east: number
) {
  const RADIUS = 6378137
  const diff_lat = diff_north / RADIUS
  const diff_lon = diff_east / (RADIUS * Math.cos((Math.PI * lat) / 180))

  const latO = lat + (diff_lat * 180) / Math.PI
  const lonO = lon + (diff_lon * 180) / Math.PI
  return [latO, lonO]
}
