WITH region AS (
  SELECT (
    SELECT coalesce(
      (SELECT wkb_geometry FROM zcta5 WHERE slug = ?0),
      (SELECT wkb_geometry FROM hrr WHERE slug = ?0)
    )
  ) AS polygons,
  (
    SELECT coalesce(
      (SELECT nhood AS name FROM zcta5 WHERE slug = ?0),
      (SELECT hrrcity AS name FROM hrr WHERE slug = ?0)
    )
  ) AS name
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
  )
)

