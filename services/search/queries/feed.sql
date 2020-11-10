SELECT json_build_object(
  'trending', (
    SELECT jsonb_agg(trending) FROM (
      SELECT COUNT(restaurant_id), restaurant.slug, restaurant.id
      FROM review
      JOIN restaurant ON restaurant_id = restaurant.id
        WHERE ST_DWithin(review.location, ST_SetSRID(ST_MakePoint(-122.4214, 37.75), 0), 0.15)
        AND authored_at > now() - interval '1 month'
      GROUP BY restaurant.slug, restaurant.id
      ORDER BY count DESC
      LIMIT ?2
    ) trending
  ),
  'newest', (
    SELECT jsonb_agg(newest) FROM (
      SELECT slug, id, oldest_review_date
      FROM restaurant
        WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(-122.4214, 37.75), 0), 0.15)
      ORDER BY oldest_review_date DESC NULLS LAST
      LIMIT ?2
    ) newest
  )
)
