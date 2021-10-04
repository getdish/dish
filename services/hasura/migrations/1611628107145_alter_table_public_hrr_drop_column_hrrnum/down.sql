
ALTER TABLE "public"."hrr" ADD COLUMN "hrrnum" int4;
ALTER TABLE "public"."hrr" ALTER COLUMN "hrrnum" DROP NOT NULL;