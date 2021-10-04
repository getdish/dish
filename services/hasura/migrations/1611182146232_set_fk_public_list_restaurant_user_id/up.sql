
alter table "public"."list_restaurant"
           add constraint "list_restaurant_user_id_fkey"
           foreign key ("user_id")
           references "public"."user"
           ("id") on update cascade on delete cascade;