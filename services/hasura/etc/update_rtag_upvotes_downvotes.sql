with updown as (
  select
  *,
  (select NULLIF(upvotes, 0) / NULLIF(downvotes, 0)) as ratio
  from (
    select
      id,
      (
        select
        (source_breakdown->'dish'->'upvotes')::numeric
        +
        (source_breakdown->'yelp'->'upvotes')::numeric
        +
        (source_breakdown->'google'->'upvotes')::numeric
        +
        (source_breakdown->'grubhub'->'upvotes')::numeric
        +
        (source_breakdown->'doordash'->'upvotes')::numeric
        +
        (source_breakdown->'michelin'->'upvotes')::numeric
        +
        (source_breakdown->'ubereats'->'upvotes')::numeric
        +
        (source_breakdown->'infatuated'->'upvotes')::numeric
        +
        (source_breakdown->'tripadvisor'->'upvotes')::numeric
      ) as upvotes,
      (
        select
        (source_breakdown->'dish'->'downvotes')::numeric
        +
        (source_breakdown->'yelp'->'downvotes')::numeric
        +
        (source_breakdown->'google'->'downvotes')::numeric
        +
        (source_breakdown->'grubhub'->'downvotes')::numeric
        +
        (source_breakdown->'doordash'->'downvotes')::numeric
        +
        (source_breakdown->'michelin'->'downvotes')::numeric
        +
        (source_breakdown->'ubereats'->'downvotes')::numeric
        +
        (source_breakdown->'infatuated'->'downvotes')::numeric
        +
        (source_breakdown->'tripadvisor'->'downvotes')::numeric
      ) as downvotes
      from restaurant_tag where source_breakdown is not null
  ) s
)

update restaurant_tag
set
  upvotes = updown.upvotes,
  downvotes = updown.downvotes,
  votes_ratio = updown.ratio
from updown
where updown.id = restaurant_tag.id
