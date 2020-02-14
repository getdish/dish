
ALTER TABLE "public"."restaurant"
ALTER COLUMN "location" TYPE geometry;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "location"
SET NOT NULL;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "image"
DROP NOT NULL;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "zip"
DROP NOT NULL;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "state"
DROP NOT NULL;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "city"
DROP NOT NULL;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "address"
DROP NOT NULL;


ALTER TABLE "public"."restaurant"
ALTER COLUMN "description"
DROP NOT NULL;


ALTER TABLE "public"."scrape" ADD COLUMN "restaurant_id" UUID NULL;


ALTER TABLE "public"."scrape" ADD CONSTRAINT "scrape_restaurant_id_fkey"
FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurant" ("id") ON
UPDATE RESTRICT ON
DELETE RESTRICT;
