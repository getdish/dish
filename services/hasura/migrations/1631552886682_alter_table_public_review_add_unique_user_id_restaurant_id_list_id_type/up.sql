
alter table "public"."review" add constraint "review_user_id_restaurant_id_list_id_type_key" unique ("user_id", "restaurant_id", "list_id", "type");