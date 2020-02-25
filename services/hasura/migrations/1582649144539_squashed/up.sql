
ALTER TABLE "public"."taxonomy" ADD COLUMN "type" text NULL;
ALTER TABLE "public"."taxonomy" ADD COLUMN "order" serial NOT NULL UNIQUE;
alter table "public"."taxonomy" rename column "parentid" to "parentId";
alter table "public"."taxonomy" rename column "parenttype" to "parentType";