DROP FUNCTION IF EXISTS restaurant_top_tags(
  restaurant_id UUID,
  tag_names TEXT
);

DROP FUNCTION IF EXISTS restaurant_top_tags(
  _restaurant restaurant,
  tag_names TEXT
);

DROP FUNCTION IF EXISTS restaurant_top_tags(
  _restaurant restaurant,
  tag_names TEXT,
  tag_types TEXT
);

CREATE OR REPLACE FUNCTION restaurant_top_tags(
  _restaurant restaurant,
  tag_names TEXT,
  _tag_types TEXT DEFAULT 'dish'
) RETURNS SETOF restaurant_tag AS $$
  WITH
  tag_slugs AS (
    SELECT UNNEST(
      string_to_array(tag_names, ',')
    )
  ),
  tag_types AS (
    SELECT UNNEST(
      string_to_array(LOWER(REPLACE(_tag_types, '-', ' ')),',')
    )
  ),
  restaurant_tags AS (
    SELECT * FROM (
      SELECT DISTINCT ON (tag.name) restaurant_tag.id as rt_id, *
        FROM restaurant_tag
        JOIN tag ON restaurant_tag.tag_id = tag.id
        WHERE restaurant_tag.restaurant_id = _restaurant.id
          AND tag.type IN (SELECT * FROM tag_types)
    ) s
      ORDER BY score DESC NULLS LAST
  )

  -- TODO: How to programmtically choose just the restaurant_tag fields?
  --       Selecting * conflicts with the strict return type of restaurant_tag
  --       because of the JOIN.
  SELECT
    tag_id,
    restaurant_id,
    rating,
    rank,
    photos,
    rt_id as id,
    score,
    score_breakdown,
    review_mentions_count,
    source_breakdown,
    upvotes,
    downvotes,
    votes_ratio
  FROM (
    SELECT *
      FROM restaurant_tags
      WHERE restaurant_tags.slug IN (SELECT * FROM tag_slugs)
    UNION ALL
    SELECT *
      FROM restaurant_tags
      WHERE NOT (restaurant_tags.slug IN (SELECT * FROM tag_slugs))
  ) s
$$ LANGUAGE sql STABLE;
