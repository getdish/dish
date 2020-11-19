// ./dishctl.sh main_db_command \
//   "select ST_AsGeoJSON(wkb_geometry) from hrr where hrrcity = 'CA- SAN FRANCISCO'" \
//   | grep '{' | node services/hasura/etc/split_multipolygon

const fs = require('fs')
const data = fs.readFileSync(0, 'utf-8')

const region = JSON.parse(data)

const coords = region.coordinates

const breakaway = {
  type: 'Polygon',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4326' } },
  coordinates: coords[3],
}
process.stdout.write(JSON.stringify(breakaway))
//console.log(breakaway)
