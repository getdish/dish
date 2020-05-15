SELECT jsonb_agg(
    json_build_object(
      'id', data.id,
      'name', data.name,
      'slug', data.slug,
      'tags', ARRAY(
        SELECT json_build_object(
          'tag', json_build_object(
            'id', id,
            'name', name,
            'icon', icon,
            'type', type
          ),
          'rating', rt.rating,
          'rank', rt.rank,
          'photos', rt.photos
        ) FROM restaurant_tag rt
          JOIN tag t ON rt.tag_id = t.id
          WHERE rt.restaurant_id = data.id
          ORDER BY rating DESC NULLS LAST
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

      AND (
        ?13 != 'FILTER BY GEMS'
        OR
        rating > 4
      )

      AND (
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
    )

    ORDER BY rating DESC NULLS LAST
    LIMIT ?5
  ) data
