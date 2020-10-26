delete from tag where id in (
  select offending_id as id from (
    select outer_tag.id as offending_id, outer_tag.name, outer_parent.name from tag outer_tag
    join tag outer_parent on outer_tag."parentId" = outer_parent.id
    where slugify(outer_tag.name) in (
      select slugify(inner_tag.name)
      from tag inner_tag
      join tag inner_parent on inner_tag."parentId" = inner_parent.id
      where outer_tag.id != inner_tag.id
      and outer_parent.name = inner_parent.name
    )
  ) s
)

