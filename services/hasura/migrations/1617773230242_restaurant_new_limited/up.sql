
CREATE OR REPLACE FUNCTION public.restaurant_new(region_slug text)
 RETURNS SETOF restaurant
 LANGUAGE sql
 STABLE
AS $function$

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
    ORDER BY oldest_review_date desc
    LIMIT 15


$function$;