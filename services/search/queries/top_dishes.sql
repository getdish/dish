WITH by_country AS (
  SELECT
    (SELECT DISTINCT t.name) AS country,
    (SELECT icon FROM taxonomy WHERE name = (SELECT DISTINCT t.name)) AS icon,
    COUNT(restaurant.id) AS frequency,
    AVG(restaurant.rating) AS avg_rating,
    (
      SELECT
        json_agg(jsonb_build_object(
          'name', name,
          'image', (
            SELECT image FROM restaurant
              WHERE tag_names @> to_jsonb(LOWER((SELECT DISTINCT t.name)))
                AND image IS NOT NULL
              ORDER BY rating DESC NULLS LAST
              LIMIT 1
          )
        )
      ) FROM taxonomy
      WHERE "parentId" IN (
        SELECT id FROM taxonomy WHERE name = (SELECT DISTINCT t.name)
      )
    ) as dishes,
    (
      SELECT json_agg(t) FROM (
        SELECT name, slug, rating FROM restaurant
        WHERE tag_names @> to_jsonb(LOWER((SELECT DISTINCT t.name)))
        ORDER BY rating DESC NULLS LAST
        LIMIT 10
      ) t
    ) as top_restaurants
  FROM restaurant
  INNER JOIN restaurant_taxonomy rt ON restaurant.id = rt.restaurant_id
  INNER JOIN taxonomy t ON rt.taxonomy_id = t.id
  WHERE t.type = 'country'
    AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
  GROUP BY t.name
)

SELECT json_agg(t) FROM (
  SELECT * FROM by_country
    WHERE frequency > 10
    ORDER BY avg_rating DESC
    LIMIT 15
) t

