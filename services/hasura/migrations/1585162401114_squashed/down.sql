

alter table "public"."top_dishes_results" rename column "dish" to "category";
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_taxonomy_id_fkey",
          add constraint "restaurant_taxonomy_taxonomy_id_fkey"
          foreign key ("taxonomy_id")
          references "public"."taxonomy"
          ("id")
          on update cascade
          on delete no action;
alter table "public"."restaurant_taxonomy" drop constraint "restaurant_taxonomy_restaurant_id_fkey",
          add constraint "restaurant_taxonomy_restaurant_id_fkey"
          foreign key ("restaurant_id")
          references "public"."restaurant"
          ("id")
          on update cascade
          on delete no action;
