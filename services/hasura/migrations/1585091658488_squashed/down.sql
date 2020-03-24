


alter table "public"."restaurant" rename column "tag_ids" to "tags";
ALTER TABLE "public"."taxonomy" ALTER COLUMN "icon" SET NOT NULL;
ALTER TABLE "public"."restaurant" DROP COLUMN "tags";
ALTER TABLE "public"."restaurant" ADD COLUMN "categories" jsonb;
ALTER TABLE "public"."restaurant" ALTER COLUMN "categories" DROP NOT NULL;
alter table "public"."taxonomy" drop constraint "taxonomy_name_key";