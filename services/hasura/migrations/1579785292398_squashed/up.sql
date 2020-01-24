
ALTER TABLE "public"."restaurant"
DROP COLUMN "location" CASCADE;


ALTER TABLE "public"."restaurant"
DROP COLUMN "longitude" CASCADE;


ALTER TABLE "public"."restaurant"
DROP COLUMN "latitude" CASCADE;


ALTER TABLE "public"."restaurant" ADD COLUMN "location" geometry NULL;
