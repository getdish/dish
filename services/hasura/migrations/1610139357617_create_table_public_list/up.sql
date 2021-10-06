
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."list"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text, "slug" text NOT NULL DEFAULT gen_random_uuid(), "comments" jsonb, PRIMARY KEY ("id") , UNIQUE ("slug"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_list_updated_at"
BEFORE UPDATE ON "public"."list"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_list_updated_at" ON "public"."list" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';