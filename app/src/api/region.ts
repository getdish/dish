import { route } from '@dish/api'
import { main_db } from '@dish/helpers-node'
import { capitalize } from 'lodash'

export default route(async (req, res) => {
  const slug = req.query['slug'] ?? ''
  const { rows } = await main_db.query(regionsQuery, [slug])
  const data = rows[0]?.json_build_object
  if (data) {
    // handle poor formatting
    if (data.name[2] === '-' && data.name[3] === ' ') {
      data.name = data.name.slice(3).trim()
    }
    // handle poor formatting
    if (data.name.toUpperCase() === data.name) {
      data.name = data.name
        .split(' ')
        .map((x) => capitalize(x))
        .join(' ')
    }
    console.log('data', data)
    res.send(data)
  } else {
    res.sendStatus(500)
  }
})

const regionsQuery = `WITH region AS (
  SELECT (
    SELECT coalesce(
      (SELECT wkb_geometry FROM zcta5 WHERE slug = $1),
      (SELECT wkb_geometry FROM hrr WHERE slug = $1)
    )
  ) AS polygons,
  (
    SELECT coalesce(
      (SELECT nhood AS name FROM zcta5 WHERE slug = $1),
      (SELECT hrrcity AS name FROM hrr WHERE slug = $1)
    )
  ) AS name,
  (
    SELECT coalesce(
      (SELECT slug FROM zcta5 WHERE slug = $1),
      (SELECT slug FROM hrr WHERE slug = $1)
    )
  ) AS slug
)

SELECT json_build_object(
  'bbox', (
    SELECT ST_AsGeoJSON(
      ST_Extent(
        polygons
      )
    )::jsonb FROM region
  ),
  'centroid', (
    SELECT ST_AsGeoJSON(
      ST_Centroid(
        polygons
      )
    )::jsonb FROM region
  ),
  'name', (
    SELECT name FROM region
  ),
  'slug', (
    SELECT slug FROM region
  )
)`
