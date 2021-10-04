
alter table "public"."list_restaurant" add constraint "list_restaurant_position_list_id_key" unique ("position", "list_id");