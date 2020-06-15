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
  )

SELECT jsonb_agg(
  json_build_object(
    'id', data.id,
    'slug', data.slug
  )) FROM (
  SELECT * FROM restaurant
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
      ?3 != ''
      AND
      name ILIKE '%' || ?3 || '%'
    )

    OR (
      ?4 != ''
      AND
      tag_names @> to_json(string_to_array(?4, ','))::jsonb
    )

    AND (
      -- TODO: do some actual "this restaurant is unique" query
      ?11 != 'FILTER BY UNIQUE'
      OR
      rating > 2
    )

    AND (
      ?12 != 'FILTER BY DELIVERS'
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
      -- date night
      ?14 != 'FILTER BY DATE'
      OR
      (rating_factors->>'ambience')::numeric > 4
    )

    AND (
      ?15 != 'FILTER BY COFFEE'
      OR
      TRUE
    )

    AND (
      ?16 != 'FILTER BY WINE'
      OR
      TRUE
    )

    AND (
      ?14 != 'FILTER BY VEGETARIAN'
      OR
      TRUE
    )

    AND (
      ?14 != 'FILTER BY QUIET'
      OR
      TRUE
    )
    -- price filter
  )

  ORDER BY

    CASE
      -- Default sort order is by the _restaurant's_ rating
      WHEN NOT EXISTS (SELECT 1 FROM dish_ids) THEN rating
      -- However, if a known dish(es) is being searched for, then order the restaurants
      -- based on the average rating of those dishes for that restaurant.
      ELSE (
        SELECT AVG(rt.rating)
          FROM restaurant_tag rt
          WHERE rt.restaurant_id = restaurant.id
            AND rt.tag_id IN (SELECT id FROM dish_ids)
      )
    END DESC NULLS LAST

  LIMIT ?5
) data
