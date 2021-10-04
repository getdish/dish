
alter table "public"."review" add constraint "review_username_restaurant_id_tag_id_authored_at_key" unique ("username", "restaurant_id", "tag_id", "authored_at");