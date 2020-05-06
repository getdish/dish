-- For finding restaurants that haven't had any scrape data added since a certain
-- date. It's a similar query to simply having a clause on the
-- `restaurant.updated_at` field, but that can't be relied on if you want to make
-- serious changes like deleting restaurants, etc.
select count(*) from
  (
    select distinct on (r.id)
      left(r.name, 20) as name,
      s.created_at as "scraped at"
    from restaurant r
    inner join scrape s on s.restaurant_id = r.id
    where st_dwithin(
      r.location, st_makepoint(-122.42, 37.76), 1
    )
    order by r.id, s.created_at desc nulls last
  ) s
  where "scraped at" < '2020-03-07'
