WITH region AS (
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
)
