
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "public"."follow"("id" uuid NOT NULL DEFAULT gen_random_uuid(), "follower_id" uuid NOT NULL, "following_id" uuid NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON UPDATE cascade ON DELETE cascade, UNIQUE ("follower_id", "following_id"));