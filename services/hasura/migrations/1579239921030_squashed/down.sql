
alter table "public"."dish" drop constraint "dish_pkey";
ALTER TABLE ONLY "public"."dish" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
COMMENT ON COLUMN "public"."dish"."id" IS E'null'

ALTER TABLE "public"."dish" DROP COLUMN "description";
alter table "public"."dish" drop constraint "dish_restaurant_id_name_key";

          alter table "public"."dish" drop constraint "dish_restaurant_id_fkey"
      
alter table "public"."dish" add constraint "dish_restaurant_id_key" unique ("restaurant_id");
ALTER TABLE "public"."dish" DROP COLUMN "price";
ALTER TABLE "public"."dish" DROP COLUMN "image";