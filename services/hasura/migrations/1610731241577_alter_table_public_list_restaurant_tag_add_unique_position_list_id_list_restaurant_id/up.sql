
alter table "public"."list_restaurant_tag" add constraint "list_restaurant_tag_position_list_id_list_restaurant_id_key" unique ("position", "list_id", "list_restaurant_id");