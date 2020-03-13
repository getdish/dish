
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."review"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "user_id" uuid NOT NULL, "restaurant_id" uuid NOT NULL, "rating" numeric NOT NULL, "text" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "categories" jsonb NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurant"("id") ON UPDATE cascade ON DELETE no action, FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE no action);
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
CREATE TRIGGER "set_public_review_updated_at"
BEFORE UPDATE ON "public"."review"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_review_updated_at" ON "public"."review" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE "public"."review" ALTER COLUMN "text" DROP NOT NULL;
ALTER TABLE "public"."review" ALTER COLUMN "categories" DROP NOT NULL;