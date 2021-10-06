
alter table "public"."list" drop constraint "list_slug_user_id_key";
alter table "public"."list" add constraint "list_slug_user_id_region_key" unique ("slug", "user_id", "region");