
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_restaurant_id_fkey",
             add constraint "restaurant_taxonomy_restaurant_id_fkey"
             foreign key ("restaurant_id")
             references "public"."restaurant"
             ("id") on update cascade on delete cascade;
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_taxonomy_id_fkey",
             add constraint "restaurant_taxonomy_taxonomy_id_fkey"
             foreign key ("taxonomy_id")
             references "public"."taxonomy"
             ("id") on update cascade on delete cascade;
alter table "public"."top_dishes_results" rename column "category" to "dish";
CREATE OR REPLACE FUNCTION public.top_dishes(lon numeric, lat numeric, radius numeric)
 RETURNS SETOF top_dishes_results
 LANGUAGE sql
 STABLE
AS $function$
  SELECT
    (SELECT DISTINCT tags) AS dish,
    COUNT(tags) AS frequency
    FROM (
      SELECT t.name
        FROM restaurant
        INNER JOIN restaurant_taxonomy rt ON restaurant.id = rt.restaurant_id
        INNER JOIN taxonomy t ON rt.taxonomy_id = t.id
        AND
          ST_DWithin(restaurant.location, ST_SetSRID(ST_MakePoint(lon, lat), 0), radius)
    ) AS dt(tags)
    GROUP BY tags ORDER BY frequency DESC limit 50
$function$;