
CREATE OR REPLACE FUNCTION public.restaurant_new(region_slug text)
 RETURNS SETOF restaurant
 LANGUAGE sql
 STABLE
AS $function$

WITH restaurants_in_region AS (
  SELECT * FROM restaurant
    WHERE ST_Within(
      location,
      ST_SetSRID(
        (
          SELECT coalesce(
            (SELECT wkb_geometry FROM zcta5 WHERE slug = region_slug),
            (SELECT wkb_geometry FROM hrr WHERE slug = region_slug)
          )
        ),
        0
      )
    )
)

SELECT restaurant.* from restaurant
  JOIN restaurants_in_region ON restaurant.id = restaurants_in_region.id
  ORDER BY oldest_review_date DESC NULLS LAST
  LIMIT 50

$function$;