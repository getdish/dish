update tag
  set frequency = matches.count
  from (
    select
      id,
      (
        select count(*) as count
          from tag m
          where m.name = tag.name
      ) as count
      from tag
  ) as matches
where tag.id = matches.id
