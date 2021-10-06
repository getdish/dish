
ALTER TABLE "public"."list" ADD COLUMN "comments" jsonb;
ALTER TABLE "public"."list" ALTER COLUMN "comments" DROP NOT NULL;