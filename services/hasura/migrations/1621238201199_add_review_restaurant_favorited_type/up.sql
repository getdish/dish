CREATE INDEX IF NOT EXISTS review_restaurant_favorited_type ON public.review USING btree (favorited, type);
