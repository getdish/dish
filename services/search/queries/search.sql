SELECT jsonb_agg(
    json_build_object(
      'id', data.id,
      'name', data.name,
      'slug', data.slug,
      'rating', data.rating,
      'address', data.address,
      'location', ST_AsGeoJSON(data.location)::json,
      'image', data.image,
      'telephone', data.telephone,
      'website', data.website,
      'sources', data.sources,
      'is_open_now', is_restaurant_open(data),
      'hours', data.hours,
      'price_range', data.price_range,
      'tag_rankings', data.tag_rankings,
      'tags', ARRAY(
        SELECT json_build_object(
          'tag', json_build_object(
            'id', id,
            'name', name,
            'icon', icon,
            'type', type
          )
        ) FROM tag
          WHERE id IN (
            SELECT rt.tag_id FROM restaurant_tag rt
            WHERE rt.restaurant_id = data.id
          )
        )
      )
  ) FROM (
    SELECT *
    FROM restaurant
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
    )

    ORDER BY rating DESC NULLS LAST
    LIMIT ?5
  ) data
