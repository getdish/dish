with dupes as (
  select
    not_proper.id as dupe_tag_id,
    not_proper.name,
    not_proper.type,
    parent.name as parent,
    (
      select array_agg(name)
      from tag
      where "parentId" = not_proper.id
    ) as dishes,
    (
      select proper.id from tag proper
      where not_proper.name = proper.name
      and proper.type = 'country'
    ) as proper_tag_id
  from tag not_proper
  join tag parent on not_proper."parentId" = parent.id
  where not_proper.name in (
    select tag_names.name from tag tag_names where tag_names.type = 'country'
  )
  and not_proper.type is null
  order by not_proper.name asc
)

-- select * from dupes

-- update restaurant_tag
-- set tag_id = dupes.proper_tag_id
-- from dupes
-- where tag_id = dupes.dupe_tag_id

-- update tag_tag
-- set tag_id = dupes.proper_tag_id
-- from dupes
-- where tag_id = dupes.dupe_tag_id

-- update review
-- set tag_id = dupes.proper_tag_id
-- from dupes
-- where tag_id = dupes.dupe_tag_id

-- update review_tag_sentence
-- set tag_id = dupes.proper_tag_id
-- from dupes
-- where tag_id = dupes.dupe_tag_id

-- update tag
-- set "parentId" = dupes.proper_tag_id
-- from dupes
-- where "parentId" = dupes.dupe_tag_id

-- delete from tag where id in (
  -- select dupe_tag_id from dupes
-- )


-- id 12312
-- name Japanese
-- parent asia

-- id 44345
-- name Japanese
-- parent 0000
