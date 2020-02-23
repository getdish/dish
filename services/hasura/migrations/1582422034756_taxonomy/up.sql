CREATE SEQUENCE taxonomy_order_seq;
CREATE TABLE public.taxonomy (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    icon text NOT NULL,
    alternates jsonb NULL,
    parentId uuid NULL,
    parentType text NULL
);
ALTER TABLE ONLY public.taxonomy
    ADD CONSTRAINT taxonomy_id_key1 UNIQUE (id);
ALTER TABLE ONLY public.taxonomy
    ADD CONSTRAINT taxonomy_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_taxonomy_updated_at BEFORE UPDATE ON public.taxonomy FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
