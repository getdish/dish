
ALTER TABLE "public"."restaurant" DROP COLUMN "tag_ids" CASCADE;
CREATE TABLE "public"."restaurant_taxonomy"("taxonomy_id" uuid NOT NULL, "restaurant_id" uuid NOT NULL, PRIMARY KEY ("taxonomy_id","restaurant_id") , FOREIGN KEY ("taxonomy_id") REFERENCES "public"."taxonomy"("id") ON UPDATE restrict ON DELETE restrict);
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_taxonomy_id_fkey";
alter table "public"."restaurant_taxonomy"
           add constraint "restaurant_taxonomy_restaurant_id_fkey"
           foreign key ("restaurant_id")
           references "public"."restaurant"
           ("id") on update restrict on delete restrict;
alter table "public"."restaurant_taxonomy"
           add constraint "restaurant_taxonomy_taxonomy_id_fkey"
           foreign key ("taxonomy_id")
           references "public"."taxonomy"
           ("id") on update cascade on delete no action;
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_restaurant_id_fkey",
             add constraint "restaurant_taxonomy_restaurant_id_fkey"
             foreign key ("restaurant_id")
             references "public"."restaurant"
             ("id") on update cascade on delete no action;