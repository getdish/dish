export function getCoordinates(geometry: {
  type: string
  coordinates: number[]
}) {
  return geometry.type === 'MultiPolygon'
    ? geometry.coordinates[0]
    : geometry.type === 'Polygon'
    ? geometry.coordinates
    : null
}
