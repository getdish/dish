
ALTER TABLE "public"."review" ALTER COLUMN "categories" SET NOT NULL;
ALTER TABLE "public"."review" ALTER COLUMN "text" SET NOT NULL;
DROP TABLE "public"."review";