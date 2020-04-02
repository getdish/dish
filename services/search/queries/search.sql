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
          'taxonomy', json_build_object(
            'id', id,
            'name', name,
            'icon', icon,
            'type', type
          )
        ) FROM taxonomy
          WHERE id IN (
            SELECT rt.taxonomy_id FROM restaurant_taxonomy rt
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
      (name ILIKE '%' || ?3 || '%' AND ?3 != '')
      OR
      (
        tag_names @> to_json(string_to_array(?4, ','))::jsonb
        AND
        ?4 != ''
      )
    )
    ORDER BY rating DESC NULLS LAST
    LIMIT ?5
  ) data
