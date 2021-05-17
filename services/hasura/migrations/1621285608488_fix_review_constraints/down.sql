ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_username_restaurant_id_tag_id_authored_at_key UNIQUE (username, restaurant_id, tag_id, authored_at);

ALTER TABLE ONLY public.review
   DROP CONSTRAINT review_username_restauarant_id_tag_id_type_key;

ALTER TABLE ONLY public.review
   DROP CONSTRAINT review_username_restauarant_id_list_id_type_key;
