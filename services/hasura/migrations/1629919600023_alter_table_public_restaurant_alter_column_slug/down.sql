
ALTER TABLE ONLY "public"."restaurant" ALTER COLUMN "slug" SET DEFAULT gen_random_uuid();
ALTER TABLE "public"."restaurant" ALTER COLUMN "slug" SET NOT NULL;