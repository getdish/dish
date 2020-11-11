import mapboxgl from 'mapbox-gl'

//['get', 'color'],
// rgbString(tagLenses[0].rgb.map((x) => x + 45)),
// [
//   'get',
//   'color',
//   // rgbString(tagLenses[0].rgb.map((x) => x + 45)),
// ],
// [
//   'match',
//   ['get', 'ethnicity'],
//   'White',
//   '#fbb03b',
//   'Black',
//   '#223b53',
//   'Hispanic',
//   '#e55e5e',
//   'Asian',
//   '#3bb2d0',
//   /* other */ '#ccc'
//   ]
// // show center/sw/ne points on map for debugging
// if (process.env.NODE_ENV === 'development') {
//   if (false) {
//     const source = map.getSource(RESTAURANTS_SOURCE_ID)
//     if (source?.type === 'geojson') {
//       source.setData({
//         type: 'FeatureCollection',
//         features: [
//           ...features,
//           // debug: add the sw, ne points
//           {
//             type: 'Feature',
//             id: Math.random(),
//             geometry: {
//               type: 'Point',
//               coordinates: [center.lng, center.lat],
//             },
//             properties: {
//               color: 'orange',
//             },
//           },
//           {
//             type: 'Feature',
//             id: Math.random(),
//             geometry: {
//               type: 'Point',
//               coordinates: [next[0], next[1]],
//             },
//             properties: {
//               color: 'blue',
//             },
//           },
//           {
//             type: 'Feature',
//             id: Math.random(),
//             geometry: {
//               type: 'Point',
//               coordinates: [next[2], next[3]],
//             },
//             properties: {
//               color: 'blue',
//             },
//           },
//         ],
//       })
//     }
//   }
// }

export function getCoordinates(
  geometry: mapboxgl.MapboxGeoJSONFeature['geometry']
) {
  return geometry.type === 'MultiPolygon'
    ? geometry.coordinates[0]
    : geometry.type === 'Polygon'
    ? geometry.coordinates
    : null
}
