
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."list_region"("restaurant_id" UUID NOT NULL, "list_id" uuid NOT NULL, "region" text NOT NULL, "id" uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY ("id") );