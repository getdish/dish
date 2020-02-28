
ALTER TABLE "public"."taxonomy" ADD COLUMN "type" text NULL;


ALTER TABLE "public"."taxonomy" ADD COLUMN "order" serial NOT NULL UNIQUE;


ALTER TABLE "public"."taxonomy" RENAME COLUMN "parentid" TO "parentId";


ALTER TABLE "public"."taxonomy" RENAME COLUMN "parenttype" TO "parentType";
