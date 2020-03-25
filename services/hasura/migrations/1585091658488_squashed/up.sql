
alter table "public"."taxonomy" add constraint "taxonomy_name_key" unique ("name");
ALTER TABLE "public"."restaurant" ADD COLUMN "tags" jsonb NULL;
ALTER TABLE "public"."taxonomy" ALTER COLUMN "icon" DROP NOT NULL;
alter table "public"."restaurant" rename column "tags" to "tag_ids";
CREATE OR REPLACE FUNCTION populate_tags(_restaurant restaurant)
RETURNS SETOF taxonomy AS $$
BEGIN
  SELECT * FROM taxonomy WHERE id IN (_restaurant.tag_ids);
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in populate_tags() - %', _restaurant;
END;
$$ LANGUAGE plpgsql STABLE;
CREATE OR REPLACE FUNCTION public.populate_tags(_restaurant restaurant)
 RETURNS SETOF taxonomy
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN QUERY SELECT * FROM taxonomy
    WHERE id = ALL ( ARRAY(
        SELECT jsonb_array_elements_text(_restaurant.tag_ids)::uuid[]
      ));
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in populate_tags() - %', _restaurant;
END;
$function$;
