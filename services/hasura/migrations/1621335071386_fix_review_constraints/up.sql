ALTER TABLE ONLY public.review
    DROP CONSTRAINT review_username_restauarant_id_list_id_type_key;

ALTER TABLE ONLY public.review
   ADD CONSTRAINT review_user_id_list_id_type_key UNIQUE (user_id, list_id, type);
