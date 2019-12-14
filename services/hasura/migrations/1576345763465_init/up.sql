CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.dish (
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid NOT NULL
);
CREATE TABLE public.restaurant (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    longitude double precision NOT NULL,
    latitude double precision NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip numeric NOT NULL,
    image text NOT NULL
);
ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_id_key1 UNIQUE (id);
ALTER TABLE ONLY public.dish
    ADD CONSTRAINT dish_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_dish_updated_at BEFORE UPDATE ON public.dish FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_dish_updated_at ON public.dish IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_restaurant_updated_at BEFORE UPDATE ON public.restaurant FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_restaurant_updated_at ON public.restaurant IS 'trigger to set value of column "updated_at" to current timestamp on row update';
