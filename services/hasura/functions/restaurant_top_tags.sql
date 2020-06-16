DROP FUNCTION IF EXISTS restaurant_top_tags(
  restaurant_id UUID,
  tag_names TEXT
);

DROP FUNCTION IF EXISTS restaurant_top_tags(
  _restaurant restaurant,
  tag_names TEXT
);

CREATE OR REPLACE FUNCTION restaurant_top_tags(
  _restaurant restaurant,
  tag_names TEXT
) RETURNS SETOF restaurant_tag AS $$
DECLARE
  dish_ids UUID[];
BEGIN
  dish_ids := ARRAY(
    SELECT id
      FROM tag
      WHERE name ILIKE ANY (
        SELECT UNNEST(
          -- TODO use our formal slugify() format.
          -- Speed optimisation isn't so important here because the tag
          -- table should always be relatively small
          string_to_array(LOWER(REPLACE(tag_names, '-', ' ')), ',')
        )
      )
        AND type != 'country'
        AND frequency < 4
  );
  RETURN QUERY
  SELECT * FROM (
    -- Put searched for tags first
    SELECT * FROM (
      SELECT * FROM restaurant_tag rt
      WHERE rt.restaurant_id = _restaurant.id
      AND rt.tag_id = ANY (dish_ids)
      ORDER BY rt.rating DESC NULLS LAST
    ) searched_for_tags
    UNION ALL
    -- All other tags
    SELECT * FROM (
      SELECT * FROM restaurant_tag rt
      WHERE rt.restaurant_id = _restaurant.id
      AND NOT (rt.tag_id = ANY (dish_ids))
      ORDER BY rt.rating DESC NULLS LAST
    ) all_other_tags
  ) top_tags;
END
$$ LANGUAGE plpgsql STABLE;
