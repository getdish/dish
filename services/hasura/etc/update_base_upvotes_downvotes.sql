with updown as (
  select
  *,
  (select NULLIF(upvotes, 0) / NULLIF(downvotes, 0)) as ratio
  from (
    select
      id,
      (
        select
        (source_breakdown->'sources'->'all'->'ratings'->'_4'->'score')::numeric
        +
        (source_breakdown->'sources'->'all'->'ratings'->'_5'->'score')::numeric
        +
        (source_breakdown->'votes'->'upvotes')::numeric
      ) as upvotes,
      (
        select
        -(source_breakdown->'sources'->'all'->'ratings'->'_1'->'score')::numeric
        +
        -(source_breakdown->'sources'->'all'->'ratings'->'_2'->'score')::numeric
        +
        (source_breakdown->'votes'->'downvotes')::numeric
      ) as downvotes
      from restaurant where source_breakdown is not null
  ) s
)

update restaurant
set
  upvotes = updown.upvotes,
  downvotes = updown.downvotes,
  votes_ratio = updown.ratio
from updown
where updown.id = restaurant.id
