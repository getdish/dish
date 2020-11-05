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

main_tag_id AS (
  SELECT id FROM tag WHERE slug = ?16
),

main AS (
  SELECT
    restaurant.id as restaurant_id,
    slug,

    -- Ranking
    DENSE_RANK() OVER(
      ORDER BY restaurant.score DESC NULLS LAST
    ) AS restaurant_rank,
    DENSE_RANK() OVER(
      ORDER BY restaurant.votes_ratio DESC NULLS LAST
    ) AS restaurant_votes_ratio_rank,
    DENSE_RANK() OVER(
      ORDER BY (
        SELECT SUM(COALESCE(rt.score, 0))
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id = (SELECT id FROM main_tag_id)
            AND rt.score IS NOT NULL
      ) DESC NULLS LAST
    ) AS main_tag_rank,
    DENSE_RANK() OVER(
      ORDER BY (
        SELECT SUM(COALESCE(rt.votes_ratio, 0))
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id = (SELECT id FROM main_tag_id)
            AND rt.score IS NOT NULL
      ) DESC NULLS LAST
    ) AS main_tag_votes_ratio_rank,
    DENSE_RANK() OVER(
      ORDER BY (
        SELECT SUM(COALESCE(rt.score, 0))
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id IN (SELECT id FROM dish_ids)
            AND rt.score IS NOT NULL
      ) DESC NULLS LAST
    ) AS rishes_rank,
    DENSE_RANK() OVER(
      ORDER BY (
        SELECT SUM(COALESCE(rt.votes_ratio, 0))
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id IN (SELECT id FROM dish_ids)
            AND rt.votes_ratio IS NOT NULL
      ) DESC NULLS LAST
    ) AS rishes_votes_ratio_rank

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
      (
        ?4 != ''
        AND
        tag_names @> to_json(string_to_array(?4, ','))::jsonb
      )
      OR
      (
        ?16 != ''
        AND
        tag_names @> to_json(?16::text)::jsonb
      )
    )

    AND (
      ?11 != 'FILTER BY DELIVERY'
      OR
      sources->>'ubereats' IS NOT NULL AND ?12 LIKE '%ubereats%'
      OR
      sources->>'grubhub' IS NOT NULL AND ?12 LIKE '%grubhub%'
      OR
      sources->>'doordash' IS NOT NULL AND ?12 LIKE '%doordash%'
    )

    AND (
      ?13 != 'FILTER BY OPEN'
      OR
      opening_hours.hours @> f_opening_hours_normalised_time(
        timezone('America/Los_Angeles', now())::timestamptz
      )
    )

    AND (
      ?14 != 'FILTER BY PRICE'
      OR
      (
        (tag_names @> '["price-low"]' AND ?15 LIKE '%price-low%')
        OR
        (tag_names @> '["price-mid"]' AND ?15 LIKE '%price-mid%')
        OR
        (tag_names @> '["price-high"]' AND ?15 LIKE '%price-high%')
        OR
        (tag_names @> '["price-higher"]' AND ?15 LIKE '%price-higher%')
        OR
        (tag_names @> '["price-highest"]' AND ?15 LIKE '%price-highest%')
      )
    )
  )

  GROUP BY restaurant.id

  ORDER BY
    (
      SELECT SUM(review_mentions_count)
        FROM restaurant_tag rt
        WHERE rt.restaurant_id = restaurant.id
          AND rt.tag_id IN (SELECT id FROM dish_ids)
    )
    DESC NULLS LAST
),

-- Convert a rank like 1/10 into a unit that can be later multiplied consistently
-- by a rank number
rank_units AS (
  SELECT
    (1.0 / MAX(restaurant_rank)) AS restaurant_rank_unit,
    (1.0 / MAX(main_tag_rank)) AS main_tag_rank_unit,
    (1.0 / MAX(rishes_rank)) AS rishes_rank_unit,
    (1.0 / MAX(restaurant_votes_ratio_rank)) AS restaurant_votes_ratio_unit,
    (1.0 / MAX(main_tag_votes_ratio_rank)) AS main_tag_votes_ratio_unit,
    (1.0 / MAX(rishes_votes_ratio_rank)) AS rishes_votes_ratio_unit
  FROM main
),

-- Order by the sum of the various ranking dimensions
final AS (
  SELECT * FROM (
    SELECT
      *,
      (
        SELECT (
          1.0 - ((main.restaurant_rank - 1.0) * restaurant_rank_unit)
        ) FROM rank_units
      ) AS restaurant_total_votes_rank_normalised_score,
      (
        SELECT (
          1.0 - ((main.restaurant_votes_ratio_rank - 1.0) * restaurant_votes_ratio_unit)
        ) FROM rank_units
      ) AS restaurant_votes_ratio_rank_normalised_score,
      (
        SELECT (
          1.0 - ((main.main_tag_rank - 1.0) * main_tag_rank_unit)
        ) FROM rank_units
      ) AS main_tag_rank_normalised_score,
      (
        SELECT (
          1.0 - ((main.main_tag_votes_ratio_rank - 1.0) * main_tag_votes_ratio_unit)
        ) FROM rank_units
      ) AS main_tag_votes_ratio_normalised_score,
      (
        SELECT (
          1.0 - ((main.rishes_rank - 1.0) * rishes_rank_unit)
        ) FROM rank_units
      ) AS rishes_rank_normalised_score,
      (
        SELECT (
          1.0 - ((main.rishes_votes_ratio_rank - 1.0) * rishes_votes_ratio_unit)
        ) FROM rank_units
      ) AS rishes_votes_ratio_rank_normalised_score
    FROM main
  ) s
  ORDER BY (
    (restaurant_total_votes_rank_normalised_score * 0.3333)
    +
    (restaurant_votes_ratio_rank_normalised_score * 1)
    +
    (main_tag_rank_normalised_score * 3)
    +
    (main_tag_votes_ratio_normalised_score * 6)
    +
    (rishes_rank_normalised_score * 0.5)
    +
    (rishes_votes_ratio_rank_normalised_score * 1)
  ) DESC
  LIMIT ?5
),

title_matches AS (
  SELECT * FROM (
    SELECT id, slug FROM restaurant
      WHERE name ILIKE '%' || regexp_replace(?3, '\W+', '%', 'g') || '%'
      AND
      (
        (ST_DWithin(restaurant.location, ST_MakePoint(?0, ?1), ?2) OR ?2 = '0')
        AND
        (
          ST_Within(
            restaurant.location,
            ST_MakeEnvelope(?6, ?7, ?8, ?9, 0)
          )
          OR ?10 = 'IGNORE BB'
        )
      )
    ORDER BY score DESC NULLS LAST
    LIMIT ?5
  ) stitlem
  WHERE ?3 != ''
),

text_matches AS (
  SELECT * FROM (
    SELECT id, slug FROM restaurant WHERE

    -- Search reviews
    restaurant.id IN (
      SELECT restaurant_id FROM review
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
      SELECT restaurant_id FROM menu_item
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

    LIMIT ?5
  ) stextm
  WHERE ?3 != ''
),

tag_matches AS (
  SELECT tag.id AS tag_id, tag.name AS name, parent.name AS cuisine FROM tag
    JOIN tag parent ON tag."parentId" = parent.id
    WHERE ?3 != ''
    AND
    (
      LOWER(?3) = LOWER(tag.name)
      OR
      LOWER(?3) = ANY(
        SELECT LOWER(
          jsonb_array_elements_text(
            tag.alternates
          )
        )
      )
    )
)

SELECT json_build_object(
  'restaurants', (
    SELECT jsonb_agg(
      json_build_object(
        'id',
          final.restaurant_id,
        'slug',
          final.slug,
        'meta', json_build_object(
          'restaurant_rank',
          final.restaurant_rank,
          'restaurant_total_votes_rank_normalised_score',
          final.restaurant_total_votes_rank_normalised_score,
          'restaurant_votes_ratio_rank',
          final.restaurant_votes_ratio_rank,
          'restaurant_votes_ratio_rank_normalised_score',
          final.restaurant_votes_ratio_rank_normalised_score,
          'main_tag_rank',
          final.main_tag_rank,
          'main_tag_rank_normalised_score',
          final.main_tag_rank_normalised_score,
          'main_tag_votes_ratio_rank',
          final.main_tag_votes_ratio_rank,
          'main_tag_votes_ratio_normalised_score',
          final.main_tag_votes_ratio_normalised_score,
          'rish_rank',
          final.rishes_rank,
          'rishes_rank_normalised_score',
          final.rishes_rank_normalised_score,
          'rishes_votes_ratio_rank',
          final.rishes_votes_ratio_rank,
          'rishes_votes_ratio_rank_normalised_score',
          final.rishes_votes_ratio_rank_normalised_score
        )
      )
    ) FROM final
  ),
  'name_matches', (
    SELECT jsonb_agg(
      json_build_object(
        'id', title_matches.id,
        'slug', title_matches.slug
      )
    ) FROM title_matches
  ),
  'text_matches', (
    SELECT jsonb_agg(
      json_build_object(
        'id', text_matches.id,
        'slug', text_matches.slug
      )
    ) FROM text_matches
  ),
  'tags', (
    SELECT jsonb_agg(
      json_build_object(
        'id', tag_matches.tag_id,
        'name', tag_matches.name,
        'cuisine', tag_matches.cuisine
      )
    ) FROM tag_matches
  ),
  'meta', (
    SELECT json_build_object(
      'query', ?3,
      'tags', ?4,
      'main_tag', ?16,
      'deliveries', ?12,
      'prices', ?15,
      'limit', ?5
    )
  )
)
