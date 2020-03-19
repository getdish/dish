
ALTER TABLE "public"."restaurant" ADD COLUMN "sources" jsonb NULL;
ALTER TABLE "public"."restaurant" ADD COLUMN "hours" jsonb NULL;
ALTER TABLE "public"."restaurant" ADD COLUMN "price_range" text NULL;