WITH restaurants_in_region AS (
  SELECT * FROM restaurant
    WHERE ST_Within(
      location,
      ST_SetSRID(
        (
          SELECT coalesce(
            (SELECT wkb_geometry FROM zcta5 WHERE slug = ?0),
            (SELECT wkb_geometry FROM hrr WHERE slug = ?0)
          )
        ),
        0
      )
    )
)

SELECT json_build_object(
  'trending', (
    SELECT jsonb_agg(trending) FROM (
      SELECT COUNT(restaurant_id), restaurants_in_region.slug, restaurants_in_region.id
      FROM review
      JOIN restaurants_in_region ON restaurant_id = restaurants_in_region.id
        WHERE authored_at > now() - interval '1 month'
      GROUP BY restaurants_in_region.slug, restaurants_in_region.id
      ORDER BY count DESC
      LIMIT ?2
    ) trending
  ),
  'newest', (
    SELECT jsonb_agg(newest) FROM (
      SELECT slug, id, oldest_review_date
      FROM restaurants_in_region
      ORDER BY oldest_review_date DESC NULLS LAST
      LIMIT ?2
    ) newest
  ),
  'total_restaurants_in_region', (
    SELECT count(*) FROM restaurants_in_region
  )

)
