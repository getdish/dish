SELECT jsonb_agg(t) FROM (
  SELECT
    tag.name as name,
    parent.name as parent,
    tag.type as type
  FROM tag
  INNER JOIN tag parent ON parent.id = tag."parentId"
    WHERE tag.name ILIKE '' || REPLACE(?0, '*', '%') || ''
    AND (
      parent.name ILIKE '' || ?1 || ''
      OR
      ?1 = ''
    )
  LIMIT ?2
) t
