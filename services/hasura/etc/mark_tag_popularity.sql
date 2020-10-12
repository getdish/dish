update tag
  set popularity = matches.count
  from (
    select
      id,
      (
        select count(*) as count
          from review_tag_sentence rts
          where rts.tag_id = tag.id
      ) as count
      from tag
  ) as matches
where tag.id = matches.id

