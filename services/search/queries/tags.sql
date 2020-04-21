SELECT jsonb_agg(t) FROM (
  SELECT
    tag.name as name,
    parent.name as parent,
    tag.type as type
  FROM tag
  INNER JOIN tag parent ON parent.id = tag."parentId"
    WHERE tag.name ILIKE '' || REPLACE(?0, '*', '%') || ''
    AND (
      parent.name = '' || ?1 || ''
      OR
      ?1 = ''
    )
    AND (
      tag.type = '' || ?2 || ''
      OR
      ?2 = ''
    )
  LIMIT ?3
) t
