
ALTER TABLE "public"."hrr" ADD COLUMN "hrr_bdry_i" float8;
ALTER TABLE "public"."hrr" ALTER COLUMN "hrr_bdry_i" DROP NOT NULL;