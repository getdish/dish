ALTER TABLE ONLY public.restaurant_tag
    ADD CONSTRAINT restaurant_tag_id_restaurant_id_pkey UNIQUE (tag_id, restaurant_id);
