
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_restaurant_id_fkey",
          add constraint "restaurant_taxonomy_restaurant_id_fkey"
          foreign key ("restaurant_id")
          references "public"."restaurant"
          ("id")
          on update restrict
          on delete restrict;
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_taxonomy_id_fkey";
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_restaurant_id_fkey";
alter table "public"."restaurant_taxonomy" add foreign key ("taxonomy_id") references "public"."taxonomy"("id") on update restrict on delete restrict;
DROP TABLE "public"."restaurant_taxonomy";
ALTER TABLE "public"."restaurant" ADD COLUMN "tag_ids" jsonb;
ALTER TABLE "public"."restaurant" ALTER COLUMN "tag_ids" DROP NOT NULL;