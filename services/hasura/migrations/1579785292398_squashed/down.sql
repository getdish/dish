
ALTER TABLE "public"."restaurant" DROP COLUMN "location";
ALTER TABLE "public"."restaurant" ADD COLUMN "latitude" float8
ALTER TABLE "public"."restaurant" ALTER COLUMN "latitude" DROP NOT NULL
ALTER TABLE "public"."restaurant" ADD COLUMN "longitude" float8
ALTER TABLE "public"."restaurant" ALTER COLUMN "longitude" DROP NOT NULL