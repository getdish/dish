import { route } from '@dish/api'
import { main_db } from '@dish/helpers-node'
import sql from 'sql-template-tag'

type SQLFilterBool = 'true' | 'false'

type FilterBy = {
  price: SQLFilterBool
  delivery: SQLFilterBool
  open: SQLFilterBool
}

const sqlFilters: Map<boolean, SQLFilterBool> = new Map()
sqlFilters.set(true, 'true')
sqlFilters.set(false, 'false')

export default route(async (req, res) => {
  const start = Date.now()
  const params = req.params
  const limit = parseFloat(params['limit'] ?? '10')
  const mainTag = params['main_tag'] ?? ''
  const distance = parseFloat(params['distance'] ?? 0)
  const lon = params['lon']
  const lat = params['lat']
  const bbParams = [lon, lat, params['span_lon'], params['span_lat']]
  const ignoreBoundingBox = sqlFilters.get(bbParams.some((x) => !x))!
  const [x, y, xd, yd] = bbParams.map((x) => parseFloat(x))
  const [x1, y1, x2, y2] = [x - xd / 2, y - yd / 2, x + xd / 2, y + yd / 2]
  const allTags = (params['tags'] ?? '').split(',').map((t) => t.trim().toLowerCase())

  const deliveryServices = ['ubereats', 'grubhub', 'doordash']
  const deliveries = allTags.some((x) => x === 'delivery')
    ? deliveryServices.join(',')
    : allTags.filter((x) => deliveryServices.includes(x)).join(',')
  const prices = allTags.filter((x) => x.startsWith('price-')).join(',')

  const specialTags = ['delivery', 'open', 'price'] as const
  const tagsWithoutSpecial = allTags
    .filter((at) => !specialTags.some((st) => at.startsWith(st)))
    .join(',')

  const filterBy: FilterBy = Object.fromEntries(
    specialTags.map(
      (t) => [t, sqlFilters.get(allTags.some((at) => at.startsWith(t)))!] as const
    )
  ) as any

  const query = getSearchQuery({
    deliveries,
    distance,
    filterBy,
    ignoreBoundingBox,
    lon,
    lat,
    limit,
    mainTag,
    prices,
    tags: tagsWithoutSpecial,
    x1,
    x2,
    y1,
    y2,
  })
  const { rows } = await main_db.query(query.text, query.values)
  const data = rows[0]?.json_build_object
  res.json(data)
})

function getSearchQuery(p: {
  lon: string
  lat: string
  distance: number
  tags: string
  limit: number
  x1: number
  y1: number
  x2: number
  y2: number
  ignoreBoundingBox: SQLFilterBool
  deliveries: string
  filterBy: FilterBy
  prices: string
  mainTag: string
}) {
  return sql`WITH

  weights AS (
    SELECT
      0.1  AS restaurant_base,
      0.2  AS restaurant_base_votes_ratio,
      0.75   AS main_tag,
      1     AS main_tag_votes_ratio,
      0.25  AS rishes,
      0.5  AS rishes_votes_ratio
  ),
  
  dish_ids AS (
    SELECT id
      FROM tag
      WHERE name ILIKE ANY (
        SELECT UNNEST(
          -- TODO use our formal slugify() format
          -- Speed optimisation isn't so important here because the tag
          -- table should always be relatively small
          string_to_array(LOWER(REPLACE(${p.tags}, '-', ' ')), ',')
        )
      )
      AND type != 'country'
  ),
  
  main_tag_id AS (
    SELECT id FROM tag WHERE slug = ${p.mainTag}
  ),
  
  main AS (
    SELECT
      restaurant.id as restaurant_id,
      slug,
      location,
      score,
  
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
      (ST_DWithin(location, ST_MakePoint(${p.lon}, ${p.lat}), ${p.distance}) OR ${p.distance} = '0')
      AND
      (
        ST_Within(
          location,
          ST_MakeEnvelope(${p.x1}, ${p.y1}, ${p.x2}, ${p.y2}, 0)
        )
        OR ${p.ignoreBoundingBox} = 'true'
      )
    )
    AND (
  
      (
        (
          ${p.tags} = ''
          OR
          tag_names @> to_json(string_to_array(${p.tags}, ','))::jsonb
        )
        AND
        (
          ${p.mainTag} = ''
          OR
          tag_names @> to_json(${p.mainTag}::text)::jsonb
        )
      )
  
      AND (
        ${p.filterBy.delivery} != 'true'
        OR
        sources->>'ubereats' IS NOT NULL AND ${p.deliveries} LIKE '%ubereats%'
        OR
        sources->>'grubhub' IS NOT NULL AND ${p.deliveries} LIKE '%grubhub%'
        OR
        sources->>'doordash' IS NOT NULL AND ${p.deliveries} LIKE '%doordash%'
      )
  
      AND (
        ${p.filterBy.open} != 'true'
        OR
        opening_hours.hours @> f_opening_hours_normalised_time(
          timezone('America/Los_Angeles', now())::timestamptz
        )
      )
  
      AND (
        ${p.filterBy.price} != 'true'
        OR
        (
          (tag_names @> '"price-low"' AND ${p.prices} LIKE '%price-low%')
          OR
          (tag_names @> '"price-mid"' AND ${p.prices} LIKE '%price-mid%')
          OR
          (tag_names @> '"price-high"' AND ${p.prices} LIKE '%price-high%')
          OR
          (tag_names @> '"price-higher"' AND ${p.prices} LIKE '%price-higher%')
          OR
          (tag_names @> '"price-highest"' AND ${p.prices} LIKE '%price-highest%')
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
  
  max_score AS (
    SELECT MAX(score) AS score FROM main
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
      (
        restaurant_total_votes_rank_normalised_score
        *
        (SELECT restaurant_base FROM weights)
      )
      +
      (
        restaurant_votes_ratio_rank_normalised_score
        *
        (SELECT restaurant_base_votes_ratio FROM weights)
      )
      +
      (
        main_tag_rank_normalised_score
        *
        (SELECT main_tag FROM weights)
      )
      +
      (
        main_tag_votes_ratio_normalised_score
        *
        (SELECT main_tag_votes_ratio FROM weights)
      )
      +
      (
        rishes_rank_normalised_score
        *
        (SELECT rishes FROM weights)
      )
      +
      (
        rishes_votes_ratio_rank_normalised_score
        *
        (SELECT rishes_votes_ratio FROM weights)
      )
    ) DESC
    LIMIT ${p.limit}
  ),
  
  title_matches AS (
    SELECT * FROM (
      SELECT id, slug FROM restaurant
        WHERE name ILIKE '%' || regexp_replace(${p.tags}, '\W+', '%', 'g') || '%'
        AND
        (
          (ST_DWithin(restaurant.location, ST_MakePoint(${p.lon}, ${p.lat}), ${p.distance}) OR ${p.distance} = '0')
          AND
          (
            ST_Within(
              restaurant.location,
              ST_MakeEnvelope(${p.x1}, ${p.y1}, ${p.x2}, ${p.y2}, 0)
            )
            OR ${p.ignoreBoundingBox} = 'true'
          )
        )
      ORDER BY score DESC NULLS LAST
      LIMIT ${p.limit}
    ) stitlem
    WHERE ${p.tags} != ''
  ),
  
  text_matches AS (
    SELECT * FROM (
      SELECT id, slug FROM restaurant WHERE
  
      -- Search reviews
      restaurant.id IN (
        SELECT restaurant_id FROM review
          WHERE
          (
            (ST_DWithin(review.location, ST_MakePoint(${p.lon}, ${p.lat}), ${p.distance}) OR ${p.distance} = '0')
            AND
            (
              ST_Within(
                review.location,
                ST_MakeEnvelope(${p.x1}, ${p.y1}, ${p.x2}, ${p.y2}, 0)
              )
              OR ${p.ignoreBoundingBox} = 'true'
            )
          )
          AND review.text ILIKE '%' || ${p.tags} || '%'
        GROUP BY review.restaurant_id
        ORDER BY count(review.restaurant_id)
      )
  
      -- Search menu items
      OR restaurant.id IN (
        SELECT restaurant_id FROM menu_item
          WHERE
          (
            (ST_DWithin(menu_item.location, ST_MakePoint(${p.lon}, ${p.lat}), ${p.distance}) OR ${p.distance} = '0')
            AND
            (
              ST_Within(
                menu_item.location,
                ST_MakeEnvelope(${p.x1}, ${p.y1}, ${p.x2}, ${p.y2}, 0)
              )
              OR ${p.ignoreBoundingBox} = 'true'
            )
          )
          AND (
            menu_item.description ILIKE '%' || ${p.tags} || '%'
            OR
            menu_item.name ILIKE '%' || ${p.tags} || '%'
          )
        GROUP BY menu_item.restaurant_id
        ORDER BY count(menu_item.restaurant_id)
      )
  
      LIMIT ${p.limit}
    ) stextm
    WHERE ${p.tags} != ''
  ),
  
  tag_matches AS (
    SELECT tag.id AS tag_id, tag.name AS name, parent.name AS cuisine FROM tag
      JOIN tag parent ON tag."parentId" = parent.id
      WHERE ${p.tags} != ''
      AND
      (
        LOWER(${p.tags}) = LOWER(tag.name)
        OR
        LOWER(${p.tags}) = ANY(
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
          'location',
            final.location,
          'meta', json_build_object(
            'restaurant_rank',
              final.restaurant_rank,
            'restaurant_base_normalised_score',
              final.restaurant_total_votes_rank_normalised_score
              *
              (SELECT score FROM max_score),
            'restaurant_base_votes_ratio_rank',
              final.restaurant_votes_ratio_rank,
            'restaurant_base_votes_ratio_normalised_score',
              final.restaurant_votes_ratio_rank_normalised_score
              *
              (SELECT score FROM max_score),
            'main_tag_rank',
              final.main_tag_rank,
            'main_tag_normalised_score',
              final.main_tag_rank_normalised_score
              *
              (SELECT score FROM max_score),
            'main_tag_votes_ratio_rank',
              final.main_tag_votes_ratio_rank,
            'main_tag_votes_ratio_normalised_score',
              final.main_tag_votes_ratio_normalised_score
              *
              (SELECT score FROM max_score),
            'rish_rank',
              final.rishes_rank,
            'rishes_normalised_score',
              final.rishes_rank_normalised_score
              *
              (SELECT score FROM max_score),
            'rishes_votes_ratio_rank',
              final.rishes_votes_ratio_rank,
            'rishes_votes_ratio_normalised_score',
              final.rishes_votes_ratio_rank_normalised_score
              *
              (SELECT score FROM max_score),
            'effective_score', (
              (
                final.restaurant_total_votes_rank_normalised_score
                *
                (SELECT restaurant_base FROM weights)
              )
              +
              (
                final.restaurant_votes_ratio_rank_normalised_score
                *
                (SELECT restaurant_base_votes_ratio FROM weights)
              )
              +
              (
                final.main_tag_rank_normalised_score
                *
                (SELECT main_tag FROM weights)
              )
              +
              (
                final.main_tag_votes_ratio_normalised_score
                *
                (SELECT main_tag_votes_ratio FROM weights)
              )
              +
              (
                final.rishes_rank_normalised_score
                *
                (SELECT rishes FROM weights)
              )
              +
              (
                final.rishes_votes_ratio_rank_normalised_score
                *
                (SELECT rishes_votes_ratio FROM weights)
              )
            ) * (SELECT score FROM max_score)
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
        'query', ${p.tags},
        'tags', ${p.tags},
        'main_tag', ${p.mainTag},
        'deliveries', ${p.deliveries},
        'prices', ${p.prices},
        'limit', ${p.limit},
        'scores',
          json_build_object(
            'highest_score', ( SELECT MAX(score) FROM main ),
            'weights',
              ( SELECT jsonb_agg(w) FROM (SELECT * FROM weights) w )->0
          )
      )
    )
  )`
}
