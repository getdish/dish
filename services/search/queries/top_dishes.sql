WITH by_country AS (
  SELECT
    (SELECT DISTINCT t.name) AS country,
    (SELECT icon FROM tag WHERE name = (SELECT DISTINCT t.name) LIMIT 1) AS icon,
    (SELECT id FROM tag WHERE name = (SELECT DISTINCT t.name) LIMIT 1) AS tag_id,
    COUNT(restaurant.id) AS frequency,
    AVG(restaurant.rating) AS avg_rating,
    (
      SELECT
        json_agg(jsonb_build_object(
          'name', name,
          'image', (
            SELECT image FROM restaurant
              WHERE tag_names @> to_jsonb(hot_tags.tag_slug)
              AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
              AND image IS NOT NULL
              ORDER BY rating DESC NULLS LAST
              LIMIT 1
          ),
          'rating', (
            SELECT AVG(rating) FROM restaurant
              WHERE tag_names @> to_jsonb(hot_tags.tag_slug)
              AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
              AND rating IS NOT NULL
          ),
          'count', count,
          'slug', tag_slug
        )
      ) FROM (
        SELECT *,
          (
            SELECT COUNT(*) FROM restaurant
              WHERE tag_names @> to_jsonb(tag_slug)
              AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
          ) AS count
        FROM (
          SELECT
            *,
            REPLACE(LOWER(tag.name), ' ', '-') AS tag_slug
            FROM tag
            WHERE "parentId" IN (
              SELECT id FROM tag WHERE tag.name = (SELECT DISTINCT t.name)
            )
        ) as tags_by_cuisine
        ORDER by count DESC
        LIMIT 10
      ) as hot_tags
    ) as dishes,
    (
      SELECT json_agg(t) FROM (
        SELECT name, slug, rating FROM restaurant
        WHERE tag_names @> to_jsonb(LOWER((SELECT DISTINCT t.name)))
        ORDER BY rating DESC NULLS LAST
        LIMIT 5
      ) t
    ) as top_restaurants
  FROM restaurant
  INNER JOIN restaurant_tag rt ON restaurant.id = rt.restaurant_id
  INNER JOIN tag t ON rt.tag_id = t.id
  WHERE t.type = 'country'
    AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
  GROUP BY t.name
)

SELECT json_agg(t) FROM (
  SELECT * FROM (
    SELECT
      country,
      icon,
      tag_id,
      frequency,
      100 as avg_rating,
      dishes,
      top_restaurants
    FROM by_country
      WHERE country = 'Vietnamese'

    UNION ALL

    SELECT * FROM by_country
      WHERE frequency > 10
      AND country != 'Vietnamese'

    ORDER BY avg_rating DESC
    LIMIT 5
  ) AS ready_to_be_reversed_but_delete_later_please
  ORDER BY avg_rating ASC
) t

