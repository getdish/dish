
alter table "public"."taxonomy" rename column "parentType" to "parenttype";
alter table "public"."taxonomy" rename column "parentId" to "parentid";
ALTER TABLE "public"."taxonomy" DROP COLUMN "order";
ALTER TABLE "public"."taxonomy" DROP COLUMN "type";