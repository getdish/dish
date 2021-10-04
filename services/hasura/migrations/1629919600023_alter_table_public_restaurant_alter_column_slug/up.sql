
ALTER TABLE "public"."restaurant" ALTER COLUMN "slug" DROP DEFAULT;
ALTER TABLE "public"."restaurant" ALTER COLUMN "slug" DROP NOT NULL;