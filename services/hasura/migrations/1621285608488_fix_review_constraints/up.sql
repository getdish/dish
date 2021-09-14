ALTER TABLE ONLY public.review
    DROP CONSTRAINT IF EXISTS review_username_restaurant_id_tag_id_authored_at_key;

ALTER TABLE ONLY public.review
   ADD CONSTRAINT review_username_restauarant_id_tag_id_type_key UNIQUE (username, restaurant_id, tag_id, type);

ALTER TABLE ONLY public.review
   ADD CONSTRAINT review_username_restauarant_id_list_id_type_key UNIQUE (username, restaurant_id, list_id, type);
