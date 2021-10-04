
CREATE OR REPLACE FUNCTION public.restaurant_with_tags(tag_slugs text)
 RETURNS SETOF restaurant
 LANGUAGE sql
 STABLE
AS $function$
    SELECT r.* FROM restaurant r
        INNER JOIN restaurant_tag rt on rt.restaurant_id = r.id
        INNER JOIN tag t on t.id = rt.tag_id
        WHERE t.slug IN (SELECT * FROM (SELECT UNNEST(string_to_array(tag_slugs, ','))) as tsa)
        ORDER BY rt.score
$function$;