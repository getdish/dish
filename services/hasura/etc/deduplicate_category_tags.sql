with categories as (
  select distinct name from tag
  where type = 'category'
),

best_and_worst as (
  select
    name,
    (
      select id from tag best
      where best.name = categories.name
      order by best.popularity desc
      limit 1
    ) as best,
    (
      select array_agg(id) from (
        select id from tag worst
        where worst.name = categories.name
        order by worst.popularity desc
        offset 1
      ) s
    ) as worst
  from categories
)

-- with dupes as (
  -- select
    -- proper.id as proper_tag_id,
    -- proper.name,
    -- (
      -- select array_agg(dupes.id)
      -- from tag dupes
        -- where dupes.name = proper.name
        -- and type = 'category'
        -- and dupes.id != proper.id
    -- ) as dupe_ids
  -- from tag
  -- where name
  -- order by proper.name asc
-- )

-- select * from best_and_worst

-- update restaurant_tag rt_to_update
-- set tag_id = best_and_worst.best
-- from best_and_worst
  -- where rt_to_update.tag_id in (
    -- select unnest(worst) from best_and_worst
  -- )
  -- and not exists (
    -- select 1 from restaurant_tag rt
    -- where rt.restaurant_id = rt_to_update.restaurant_id
    -- and rt.tag_id = best_and_worst.best
  -- )

-- delete from tag where id in (
  -- select unnest(best_and_worst.worst) from best_and_worst
-- )

delete from tag a
using tag b
  where a.type = 'category'
  and b.type = 'category'
  and a.id < b.id
  and slugify(a.name) = slugify(b.name)
