
alter table "public"."list_restaurant_tag" add constraint "list_restaurant_tag_list_id_list_restaurant_id_restaurant_tag_id_key" unique ("list_id", "list_restaurant_id", "restaurant_tag_id");