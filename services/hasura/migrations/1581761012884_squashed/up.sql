
ALTER TABLE "public"."restaurant" ADD COLUMN "telephone" text NULL;
ALTER TABLE "public"."restaurant" ADD COLUMN "website" text NULL;
ALTER TABLE "public"."restaurant" ADD COLUMN "categories" jsonb NULL;
ALTER TABLE "public"."restaurant" ADD COLUMN "photos" jsonb NULL;