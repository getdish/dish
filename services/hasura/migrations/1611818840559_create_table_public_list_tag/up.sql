
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."list_tag"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "list_id" uuid NOT NULL, "tag_id" uuid NOT NULL, PRIMARY KEY ("id") , UNIQUE ("list_id", "tag_id", "id"));