WITH by_country AS (
  SELECT
    (SELECT DISTINCT cuisine_tag.name) AS country,
    (SELECT icon FROM tag WHERE id = (SELECT DISTINCT cuisine_tag.id) LIMIT 1) AS icon,
    (SELECT id FROM tag WHERE id = (SELECT DISTINCT cuisine_tag.id) LIMIT 1) AS tag_id,
    COUNT(restaurant.id) AS frequency,
    AVG(restaurant.score) AS avg_score,
    (
      SELECT
        json_agg(jsonb_build_object(
          'name', name,
          'image', (
            SELECT hot_tags.default_images->0
          ),
          'slug', tag_slug,
          'count', matching_restaurants_count,
          'avg_score', (
            SELECT AVG(trbda_rt.score) FROM restaurant trbda
            JOIN restaurant_tag trbda_rt ON trbda_rt.restaurant_id = trbda.id
              WHERE ST_DWithin(trbda.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
              AND trbda_rt.tag_id = hot_tags.id
              AND trbda_rt.score IS NOT NULL
          ),
          'best_restaurants', (SELECT json_agg(t)
            FROM (
              SELECT trbdb.id, trbdb.name, trbdb.slug, AVG(trbdb_rt.score) as dish_score FROM restaurant trbdb
              JOIN restaurant_tag trbdb_rt ON trbdb_rt.restaurant_id = trbdb.id
                WHERE ST_DWithin(trbdb.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
                AND trbdb_rt.tag_id = hot_tags.id
                AND trbdb_rt.score IS NOT NULL
              GROUP BY trbdb.id
              ORDER BY AVG(trbdb_rt.score) DESC
              LIMIT 5
            ) t
          )
        )
      ) FROM (
        SELECT *,
          (
            SELECT COUNT(restaurant.id) FROM restaurant
              JOIN restaurant_tag ON restaurant_id = restaurant.id
              WHERE tags_by_cuisine.id = restaurant_tag.tag_id
                AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
                AND restaurant.score > 0
          ) AS matching_restaurants_count
        FROM (
          SELECT
            *,
            REPLACE(LOWER(tag.name), ' ', '-') AS tag_slug
            FROM tag
            WHERE "parentId" IN (
              SELECT id FROM tag WHERE tag.id = (SELECT DISTINCT cuisine_tag.id)
            )
            AND tag.type != 'category'
            AND tag.frequency < 4
        ) as tags_by_cuisine
        ORDER BY matching_restaurants_count DESC
        LIMIT 10
      ) as hot_tags
      WHERE matching_restaurants_count > 0
    ) as dishes,
    (
      SELECT json_agg(t) FROM (
        SELECT trbc.id, trbc.name, trbc.slug, trbc.score FROM restaurant trbc
        JOIN restaurant_tag trbc_rt ON trbc_rt.restaurant_id = trbc.id
          WHERE ST_DWithin(trbc.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
          AND trbc_rt.tag_id = (SELECT DISTINCT cuisine_tag.id)
        GROUP BY trbc.id
        ORDER BY AVG(trbc.score) DESC NULLS LAST
        LIMIT 6
      ) t
    ) as top_restaurants
  FROM restaurant
  JOIN restaurant_tag rt ON restaurant.id = rt.restaurant_id
  JOIN tag cuisine_tag ON rt.tag_id = cuisine_tag.id
  WHERE cuisine_tag.type = 'country'
    AND ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(?0, ?1), 0), ?2)
  GROUP BY cuisine_tag.id
)

SELECT json_agg(t) FROM (
  SELECT * FROM by_country
    WHERE frequency > 50
  ORDER BY avg_score DESC
  LIMIT 10
) t

