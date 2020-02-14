

          alter table "public"."scrape" drop constraint "scrape_restaurant_id_fkey"
      
ALTER TABLE "public"."scrape" DROP COLUMN "restaurant_id";
ALTER TABLE "public"."restaurant" ALTER COLUMN "description" SET NOT NULL;
COMMENT ON COLUMN "public"."restaurant"."description" IS E'null'
ALTER TABLE "public"."restaurant" ALTER COLUMN "address" SET NOT NULL;
COMMENT ON COLUMN "public"."restaurant"."address" IS E'null'
ALTER TABLE "public"."restaurant" ALTER COLUMN "city" SET NOT NULL;
COMMENT ON COLUMN "public"."restaurant"."city" IS E'null'
ALTER TABLE "public"."restaurant" ALTER COLUMN "state" SET NOT NULL;
COMMENT ON COLUMN "public"."restaurant"."state" IS E'null'
ALTER TABLE "public"."restaurant" ALTER COLUMN "zip" SET NOT NULL;
COMMENT ON COLUMN "public"."restaurant"."zip" IS E'null'
ALTER TABLE "public"."restaurant" ALTER COLUMN "image" SET NOT NULL;
COMMENT ON COLUMN "public"."restaurant"."image" IS E'null'