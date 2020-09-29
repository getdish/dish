WITH

dish_ids AS (
  SELECT id
    FROM tag
    WHERE name ILIKE ANY (
      SELECT UNNEST(
        -- TODO use our formal slugify() format
        -- Speed optimisation isn't so important here because the tag
        -- table should always be relatively small
        string_to_array(LOWER(REPLACE(?4, '-', ' ')), ',')
      )
    )
    AND type != 'country'
),

main AS (
  SELECT
    restaurant.id as restaurant_id,
    slug,
    DENSE_RANK() OVER(
      ORDER BY restaurant.score DESC NULLS LAST
    ) AS restaurant_rank,
    DENSE_RANK() OVER(
      ORDER BY (
        SELECT SUM(COALESCE(rt.score, 0))
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id IN (SELECT id FROM dish_ids)
            AND rt.score IS NOT NULL
      ) DESC NULLS LAST
    ) AS rishes_rank
  FROM restaurant
  LEFT JOIN opening_hours ON opening_hours.restaurant_id = restaurant.id
  WHERE (
    (ST_DWithin(location, ST_MakePoint(?0, ?1), ?2) OR ?2 = '0')
    AND
    (
      ST_Within(
        location,
        ST_MakeEnvelope(?6, ?7, ?8, ?9, 0)
      )
      OR ?10 = 'IGNORE BB'
    )
  )
  AND (

    (
      (?3 = '' AND ?4 = '')
      OR
      (
        ?3 != ''
        AND (
          -- Search restaurant titles
          name ILIKE '%' || ?3 || '%'

          -- Search reviews
          OR restaurant.id IN (
            SELECT
              restaurant_id
            FROM review
            WHERE
              (
                (ST_DWithin(review.location, ST_MakePoint(?0, ?1), ?2) OR ?2 = '0')
                AND
                (
                  ST_Within(
                    review.location,
                    ST_MakeEnvelope(?6, ?7, ?8, ?9, 0)
                  )
                  OR ?10 = 'IGNORE BB'
                )
              )
              AND review.text ILIKE '%' || ?3 || '%'
            GROUP BY review.restaurant_id
            ORDER BY count(review.restaurant_id)
          )

          -- Search menu items
          OR restaurant.id IN (
            SELECT
              restaurant_id
            FROM menu_item
            WHERE
              (
                (ST_DWithin(menu_item.location, ST_MakePoint(?0, ?1), ?2) OR ?2 = '0')
                AND
                (
                  ST_Within(
                    menu_item.location,
                    ST_MakeEnvelope(?6, ?7, ?8, ?9, 0)
                  )
                  OR ?10 = 'IGNORE BB'
                )
              )
              AND (
                menu_item.description ILIKE '%' || ?3 || '%'
                OR
                menu_item.name ILIKE '%' || ?3 || '%'
              )
            GROUP BY menu_item.restaurant_id
            ORDER BY count(menu_item.restaurant_id)
          )
        )
      ) OR (
        ?4 != ''
        AND
        tag_names @> to_json(string_to_array(?4, ','))::jsonb
      )
    )

    AND (
      -- TODO: do some actual "this restaurant is unique" query
      ?11 != 'FILTER BY UNIQUE'
      OR
      rating > 2
    )

    AND (
      ?12 != 'FILTER BY DELIVERY'
      OR
      sources->>'ubereats' IS NOT NULL
      OR
      sources->>'grubhub' IS NOT NULL
      OR
      sources->>'doordash' IS NOT NULL
    )

    AND (
      ?13 != 'FILTER BY GEMS'
      OR
      rating > 4
    )

    AND (
      ?14 != 'FILTER BY VIBE'
      OR
      (rating_factors->>'ambience')::numeric > 4
    )

    AND (
      ?15 != 'FILTER BY VEGETARIAN'
      OR
      TRUE
    )

    AND (
      ?16 != 'FILTER BY QUIET'
      OR
      TRUE
    )

    AND (
      ?17 != 'FILTER BY OPEN'
      OR
      opening_hours.hours @> f_opening_hours_normalised_time(
        timezone('America/Los_Angeles', now())::timestamptz
      )
    )

    AND (
      ?18 != 'FILTER BY PRICE'
      OR
      (
        (tag_names @> '["price-low"]' AND ?19 LIKE '%price-low%')
        OR
        (tag_names @> '["price-mid"]' AND ?19 LIKE '%price-mid%')
        OR
        (tag_names @> '["price-high"]' AND ?19 LIKE '%price-high%')
        OR
        (tag_names @> '["price-higher"]' AND ?19 LIKE '%price-higher%')
        OR
        (tag_names @> '["price-highest"]' AND ?19 LIKE '%price-highest%')
      )
    )
  )

  GROUP BY restaurant.id

  ORDER BY

    CASE
      -- Default sort order is by the _restaurant's_ score
      WHEN NOT EXISTS (SELECT 1 FROM dish_ids) THEN score
      -- However, if a known dish(es) is being searched for, then order the restaurants
      -- based on the number of mentions of those dishes
      ELSE (
        SELECT SUM(review_mentions_count)
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id IN (SELECT id FROM dish_ids)
      )
    END DESC NULLS LAST
),

-- Convert a rank like 1/10 into a unit that can be later multiplied consistently
-- by a rank number
rank_units AS (
  SELECT
    (1.0 / MAX(restaurant_rank)) AS restaurant_rank_unit,
    (1.0 / MAX(rishes_rank)) AS rishes_rank_unit
  FROM main
),

-- Order by the sum of the restaurant rank score and the rish rank score
final AS (
  SELECT * FROM (
    SELECT
      *,
      (
        SELECT (
          1.0 - ((main.restaurant_rank - 1.0) * restaurant_rank_unit)
        ) FROM rank_units
      ) as restaurant_rank_score,
      (
        SELECT (
          1.0 - ((main.rishes_rank - 1.0) * rishes_rank_unit)
        ) FROM rank_units
      ) as rishes_rank_score
    FROM main
  ) s
  ORDER BY (restaurant_rank_score + rishes_rank_score) DESC
)

SELECT jsonb_agg(
  json_build_object(
    'id', final.restaurant_id,
    'slug', final.slug,
    'restaurant_rank', final.restaurant_rank,
    'restaurant_rank_score', final.restaurant_rank_score,
    'rish_rank', final.rishes_rank,
    'rish_rank_score', final.rishes_rank_score
  )
) FROM final
LIMIT ?5
