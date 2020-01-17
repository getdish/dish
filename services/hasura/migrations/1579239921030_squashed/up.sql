
ALTER TABLE "public"."dish" ADD COLUMN "restaurant_id" UUID NOT NULL UNIQUE;


ALTER TABLE "public"."dish" ADD COLUMN "image" text NULL;


ALTER TABLE "public"."dish" ADD COLUMN "price" integer NULL;


ALTER TABLE "public"."dish"
DROP CONSTRAINT "dish_restaurant_id_key";


ALTER TABLE "public"."dish" ADD CONSTRAINT "dish_restaurant_id_fkey"
FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurant" ("id") ON
UPDATE CASCADE ON
DELETE CASCADE;


ALTER TABLE "public"."dish" ADD CONSTRAINT "dish_restaurant_id_name_key" UNIQUE ("restaurant_id",
                                                                                 "name");


ALTER TABLE "public"."dish" ADD COLUMN "description" text NULL;


ALTER TABLE dish
DROP CONSTRAINT dish_pkey;


ALTER TABLE ONLY "public"."dish"
ALTER COLUMN "id"
SET DEFAULT gen_random_uuid();


ALTER TABLE "public"."dish" ADD CONSTRAINT "dish_pkey" PRIMARY KEY ("id");
