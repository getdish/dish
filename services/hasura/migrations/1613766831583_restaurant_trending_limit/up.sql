
CREATE OR REPLACE FUNCTION public.restaurant_trending(region_slug text)
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
),

trending_restaurants_in_region AS (
    SELECT COUNT(restaurant_id) as count, restaurants_in_region.id
      FROM review
      JOIN restaurants_in_region ON restaurant_id = restaurants_in_region.id
        WHERE authored_at > now() - interval '2 months'
      GROUP BY restaurants_in_region.slug, restaurants_in_region.id
      ORDER BY count DESC
)

SELECT restaurant.* from restaurant
  JOIN trending_restaurants_in_region ON restaurant.id = trending_restaurants_in_region.id
  ORDER BY trending_restaurants_in_region.count
  LIMIT 50

$function$;