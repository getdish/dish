CREATE EXTENSION postgis;
CREATE EXTENSION unaccent;
CREATE EXTENSION btree_gist;
CREATE EXTENSION pg_trgm;
CREATE FUNCTION public.f_opening_hours_hours(_from timestamp with time zone, _to timestamp with time zone) RETURNS TABLE(opening_hours_range tsrange)
    LANGUAGE plpgsql IMMUTABLE COST 1000 ROWS 1
    AS $$
DECLARE
   ts_from timestamp := f_opening_hours_normalised_time(_from);
   ts_to   timestamp := f_opening_hours_normalised_time(_to);
BEGIN
   -- test input for sanity (optional)
   IF _to <= _from THEN
      RAISE EXCEPTION '%', '_to must be later than _from!';
   ELSIF _to > _from + interval '1 week' THEN
      RAISE EXCEPTION '%', 'Interval cannot span more than a week!';
   END IF;
   IF ts_from > ts_to THEN  -- split range at Mon 00:00
      RETURN QUERY
      VALUES (tsrange('1996-01-01 0:0', ts_to  , '[]'))
           , (tsrange(ts_from, '1996-01-08 0:0', '[]'));
   ELSE                     -- simple case: range in standard week
      opening_hours_range := tsrange(ts_from, ts_to, '[]');
      RETURN NEXT;
   END IF;
   RETURN;
END
$$;
CREATE FUNCTION public.f_opening_hours_normalised_time(timestamp with time zone) RETURNS timestamp without time zone
    LANGUAGE sql IMMUTABLE
    AS $_$
SELECT date '1996-01-01'
    + ($1 AT TIME ZONE 'UTC' - date_trunc('week', $1 AT TIME ZONE 'UTC'))
$_$;
CREATE TABLE public.restaurant (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text,
    address text,
    city text,
    state text,
    zip numeric,
    image text,
    location public.geometry NOT NULL,
    telephone text,
    website text,
    photos jsonb,
    rating numeric,
    slug text DEFAULT public.gen_random_uuid() NOT NULL,
    sources jsonb,
    hours jsonb,
    price_range text,
    tag_names jsonb,
    rating_factors jsonb,
    headlines jsonb,
    geocoder_id text,
    score numeric,
    score_breakdown jsonb,
    summary text,
    source_breakdown jsonb,
    upvotes numeric,
    downvotes numeric,
    votes_ratio numeric,
    oldest_review_date timestamp with time zone
);
CREATE FUNCTION public.is_restaurant_open(_restaurant public.restaurant) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1
        FROM opening_hours
        WHERE _restaurant.id = opening_hours.restaurant_id
          AND hours @> f_opening_hours_normalised_time(now())
    );
  END;
  $$;
CREATE FUNCTION public.menu_item_defaults_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF new.location IS NULL THEN
    new.location := (SELECT location FROM restaurant WHERE new.restaurant_id = restaurant.id);
  END IF;
  RETURN new;
END
$$;
CREATE FUNCTION public.nhood_triggers() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.slug = slugify(NEW.nhood);
  RETURN NEW;
END
$$;
CREATE TABLE public.tag (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    icon text,
    alternates jsonb,
    "parentId" uuid DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    type text,
    "order" integer NOT NULL,
    "displayName" text,
    rgb jsonb,
    is_ambiguous boolean DEFAULT false NOT NULL,
    misc jsonb,
    default_images jsonb,
    frequency integer,
    description text,
    popularity integer,
    slug text
);
CREATE FUNCTION public.populate_tags(_restaurant public.restaurant) RETURNS SETOF public.tag
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
  RETURN QUERY SELECT * FROM taxonomy
    WHERE id = ALL ( ARRAY(
        SELECT jsonb_array_elements_text(_restaurant.tag_ids)::uuid[]
      ));
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in populate_tags() - %', _restaurant;
END;
$$;
CREATE FUNCTION public.region_triggers() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.slug = slugify(NEW.hrrcity);
  RETURN NEW;
END
$$;
CREATE TABLE public.restaurant_tag (
    tag_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    rating numeric,
    rank integer,
    photos jsonb,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    score numeric,
    score_breakdown jsonb,
    review_mentions_count numeric,
    source_breakdown jsonb,
    upvotes numeric,
    downvotes numeric,
    votes_ratio numeric
);
CREATE FUNCTION public.restaurant_top_tags(_restaurant public.restaurant, tag_slugs text, _tag_types text DEFAULT 'dish'::text) RETURNS SETOF public.restaurant_tag
    LANGUAGE sql STABLE
    AS $$
  WITH
  tag_slugs_array AS (
    SELECT UNNEST(
      string_to_array(tag_slugs, ',')
    )
  ),
  tag_types AS (
    SELECT UNNEST(
      string_to_array(LOWER(REPLACE(_tag_types, '-', ' ')), ',')
    )
  ),
  restaurant_tags AS (
    SELECT * FROM (
      SELECT DISTINCT ON (tag.name) restaurant_tag.id as rt_id, *
        FROM restaurant_tag
        JOIN tag ON restaurant_tag.tag_id = tag.id
        WHERE restaurant_tag.restaurant_id = _restaurant.id
          AND tag.type IN (SELECT * FROM tag_types)
    ) s
  )
  -- TODO: How to programmtically choose just the restaurant_tag fields?
  --       Selecting * conflicts with the strict return type of restaurant_tag
  --       because of the JOIN.
  SELECT
    tag_id,
    restaurant_id,
    rating,
    rank,
    photos,
    rt_id as id,
    score,
    score_breakdown,
    review_mentions_count,
    source_breakdown,
    upvotes,
    downvotes,
    votes_ratio
  FROM (
    SELECT * FROM (
      (
        SELECT *, 1 AS ord FROM restaurant_tags
        WHERE restaurant_tags.slug IN (SELECT * FROM tag_slugs_array)
      )
      UNION ALL
      (
        SELECT *, 2 AS ord FROM restaurant_tags
        WHERE NOT (restaurant_tags.slug IN (SELECT * FROM tag_slugs_array))
        ORDER BY score DESC NULLS LAST
      )
    ) s1
    -- TODO: Whether it is Postgres or Hasura, ordering by `ord` is not preserved!
    --       Ordering is handled in our @graph package
    ORDER BY ord ASC
  ) s2
$$;
CREATE FUNCTION public.review_defaults_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF new.username IS NULL THEN
    new.username := (SELECT username FROM "user" WHERE new.user_id = "user".id);
    IF new.tag_id IS NULL THEN
      new.tag_id := '00000000-0000-0000-0000-000000000000';
    END IF;
    new.native_data_unique_key := new.user_id::text || new.restaurant_id::text || new.tag_id::text;
  END IF;
  new.location := (SELECT location FROM restaurant WHERE new.restaurant_id = restaurant.id);
  RETURN new;
END
$$;
CREATE FUNCTION public.review_score_sync() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.vote IS NOT NULL THEN
    IF (NEW.restaurant_id IS NOT NULL AND NEW.tag_id IS NOT NULL) THEN
      UPDATE restaurant_tag
      SET score = COALESCE(score, 0) + NEW.vote
        WHERE restaurant_id = NEW.restaurant_id
        AND tag_id = NEW.tag_id;
    END IF;
    IF (
      NEW.restaurant_id IS NOT NULL AND (
        NEW.tag_id = '00000000-0000-0000-0000-000000000000'
        OR
        NEW.tag_id IS NULL
      )
    ) THEN
      UPDATE restaurant
      SET score = COALESCE(score, 0) + NEW.vote
        WHERE id = NEW.restaurant_id;
    END IF;
  END IF;
  RETURN NEW;
END
$$;
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
CREATE FUNCTION public.set_slug_from_title() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  standard varchar := slugify(NEW.name);
  with_city varchar := slugify(concat(NEW.name, '-', NEW.city));
  with_address varchar = slugify(concat(NEW.name, '-', NEW.city, '-', NEW.address));
BEGIN
  IF EXISTS (SELECT FROM restaurant WHERE slug = standard AND id != NEW.id) THEN
    IF EXISTS (SELECT FROM restaurant WHERE slug = with_city AND id != NEW.id) THEN
      IF EXISTS (SELECT FROM restaurant WHERE slug = with_address AND id != NEW.id) THEN
        NEW.slug := gen_random_uuid();
      ELSE
        NEW.slug := with_address;
      END IF;
    ELSE
      NEW.slug := with_city;
    END IF;
  ELSE
    NEW.slug := standard;
  END IF;
  RETURN NEW;
END
$$;
CREATE FUNCTION public.slugify(value text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
  -- removes accents (diacritic signs) from a given string --
  WITH "unaccented" AS (
    SELECT unaccent("value") AS "value"
  ),
  -- lowercases the string
  "lowercase" AS (
    SELECT lower("value") AS "value"
    FROM "unaccented"
  ),
  -- remove single and double quotes
  "removed_quotes" AS (
    SELECT regexp_replace("value", '[''"]+', '', 'gi') AS "value"
    FROM "lowercase"
  ),
  -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
  "hyphenated" AS (
    SELECT regexp_replace("value", '[^a-z0-9\\-_]+', '-', 'gi') AS "value"
    FROM "removed_quotes"
  ),
  -- trims hyphens('-') if they exist on the head or tail of the string
  "trimmed" AS (
    SELECT regexp_replace(regexp_replace("value", '\-+$', ''), '^\-', '') AS "value"
    FROM "hyphenated"
  )
  SELECT "value" FROM "trimmed";
$_$;
CREATE FUNCTION public.tag_triggers() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (SELECT COUNT(*) > 0 FROM tag WHERE name = NEW.name) THEN
    UPDATE tag SET is_ambiguous = TRUE
      WHERE name = NEW.name
      AND id != NEW.id
      AND is_ambiguous = FALSE;
  ELSE
    UPDATE tag SET is_ambiguous = FALSE
      AND id = NEW.id;
  END IF;
  IF NEW."displayName" IS NULL THEN
    UPDATE tag SET "displayName" = NEW.name WHERE id = NEW.id;
  END IF;
  UPDATE tag SET
    slug = new_slug.slug
  FROM (
    SELECT slugify(parent.name) || '__' || slugify(child.name) AS slug
    FROM tag child JOIN tag parent ON child."parentId" = parent.id
      WHERE child.id = NEW.id
  ) new_slug
    WHERE tag.id = NEW.id
    AND (
      tag.slug <> new_slug.slug
      OR
      tag.slug IS NULL
    );
  RETURN NEW;
END
$$;
CREATE TABLE public.hrr (
    ogc_fid integer NOT NULL,
    hrr_bdry_i double precision,
    hrrnum integer,
    hrrcity character varying,
    wkb_geometry public.geometry(Geometry,4326),
    slug text
);
CREATE SEQUENCE public.hrr_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.hrr_ogc_fid_seq OWNED BY public.hrr.ogc_fid;
CREATE TABLE public.menu_item (
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    image text,
    price integer,
    description text,
    location public.geometry
);
CREATE TABLE public.nhood_labels (
    center public.geometry(Geometry,4326) NOT NULL,
    name text NOT NULL,
    ogc_fid integer NOT NULL
);
CREATE TABLE public.opening_hours (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    hours tsrange NOT NULL,
    restaurant_id uuid NOT NULL,
    CONSTRAINT opening_hours_bounds_inclusive CHECK ((lower_inc(hours) AND upper_inc(hours))),
    CONSTRAINT opening_hours_standard_week CHECK ((hours <@ '["1996-01-01 00:00:00","1996-01-08 00:00:00"]'::tsrange))
);
CREATE TABLE public.photo (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    url text,
    quality numeric,
    origin text
);
CREATE TABLE public.photo_xref (
    photo_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type text
);
CREATE TABLE public.review (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    rating numeric,
    text text,
    authored_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    categories jsonb,
    tag_id uuid,
    favorited boolean,
    source text DEFAULT 'dish'::text,
    username text,
    location public.geometry,
    native_data_unique_key text,
    vote numeric,
    type text
);
CREATE TABLE public.review_tag_sentence (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    tag_id uuid NOT NULL,
    review_id uuid NOT NULL,
    sentence text NOT NULL,
    naive_sentiment numeric NOT NULL,
    ml_sentiment numeric,
    restaurant_id uuid
);
CREATE TABLE public.setting (
    key text NOT NULL,
    value jsonb NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
CREATE TABLE public.tag_tag (
    tag_id uuid NOT NULL,
    category_tag_id uuid NOT NULL
);
CREATE SEQUENCE public.taxonomy_order_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE SEQUENCE public.taxonomy_order_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.taxonomy_order_seq1 OWNED BY public.tag."order";
CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email text,
    apple_uid text,
    apple_email text,
    apple_token text,
    apple_refresh_token text,
    has_onboarded boolean DEFAULT false NOT NULL,
    location text,
    about text,
    avatar text,
    "charIndex" integer DEFAULT 0 NOT NULL,
    password_reset_token text,
    password_reset_date timestamp with time zone
);
CREATE TABLE public.zcta5 (
    ogc_fid integer NOT NULL,
    zcta5ce10 character varying,
    geoid10 character varying,
    classfp10 character varying,
    mtfcc10 character varying,
    funcstat10 character varying,
    aland10 double precision,
    awater10 double precision,
    intptlat10 character varying,
    intptlon10 character varying,
    wkb_geometry public.geometry(Geometry,4326),
    nhood text,
    slug text
);
CREATE SEQUENCE public.zcta5_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.zcta5_ogc_fid_seq OWNED BY public.zcta5.ogc_fid;
ALTER TABLE ONLY public.hrr ALTER COLUMN ogc_fid SET DEFAULT nextval('public.hrr_ogc_fid_seq'::regclass);
ALTER TABLE ONLY public.tag ALTER COLUMN "order" SET DEFAULT nextval('public.taxonomy_order_seq1'::regclass);
ALTER TABLE ONLY public.zcta5 ALTER COLUMN ogc_fid SET DEFAULT nextval('public.zcta5_ogc_fid_seq'::regclass);
ALTER TABLE ONLY public.hrr
    ADD CONSTRAINT hrr_pkey PRIMARY KEY (ogc_fid);
ALTER TABLE ONLY public.hrr
    ADD CONSTRAINT hrr_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_restaurant_id_name_key UNIQUE (restaurant_id, name);
ALTER TABLE ONLY public.nhood_labels
    ADD CONSTRAINT nhood_labels_pkey PRIMARY KEY (ogc_fid);
ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_no_overlap EXCLUDE USING gist (restaurant_id WITH =, hours WITH &&);
ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.photo
    ADD CONSTRAINT photo_origin_key UNIQUE (origin);
ALTER TABLE ONLY public.photo
    ADD CONSTRAINT photo_url_key UNIQUE (url);
ALTER TABLE ONLY public.photo
    ADD CONSTRAINT photos_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.photo_xref
    ADD CONSTRAINT photos_xref_photos_id_restaurant_id_tag_id_key UNIQUE (photo_id, restaurant_id, tag_id);
ALTER TABLE ONLY public.photo_xref
    ADD CONSTRAINT photos_xref_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_geocoder_id_key UNIQUE (geocoder_id);
ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_name_address_key UNIQUE (name, address);
ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.restaurant_tag
    ADD CONSTRAINT restaurant_tag_id_key UNIQUE (id);
ALTER TABLE ONLY public.restaurant_tag
    ADD CONSTRAINT restaurant_tag_pkey PRIMARY KEY (tag_id, restaurant_id);
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_native_data_unique_key_key UNIQUE (native_data_unique_key);
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.review_tag_sentence
    ADD CONSTRAINT review_tag_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.review_tag_sentence
    ADD CONSTRAINT review_tag_tag_id_review_id_sentence_key UNIQUE (tag_id, review_id, sentence);
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_username_restaurant_id_tag_id_authored_at_key UNIQUE (username, restaurant_id, tag_id, authored_at);
ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_id_key UNIQUE (id);
ALTER TABLE ONLY public.setting
    ADD CONSTRAINT setting_pkey PRIMARY KEY (key);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_id_key1 UNIQUE (id);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_order_key UNIQUE ("order");
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "tag_parentId_name_key" UNIQUE ("parentId", name);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.tag_tag
    ADD CONSTRAINT tag_tag_pkey PRIMARY KEY (tag_id, category_tag_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
ALTER TABLE ONLY public.zcta5
    ADD CONSTRAINT zcta5_pkey PRIMARY KEY (ogc_fid);
ALTER TABLE ONLY public.zcta5
    ADD CONSTRAINT zcta5_slug_key UNIQUE (slug);
CREATE INDEX dish_name_trgm_idx ON public.menu_item USING gin (name public.gin_trgm_ops);
CREATE INDEX hrr_wkb_geometry_geom_idx ON public.hrr USING gist (wkb_geometry);
CREATE INDEX menu_item_description_trgm_idx ON public.menu_item USING gin (description public.gin_trgm_ops);
CREATE INDEX menu_item_restaurant_id_idx ON public.menu_item USING btree (restaurant_id);
CREATE INDEX opening_hours_restaurant_id_idx ON public.opening_hours USING btree (restaurant_id);
CREATE INDEX opening_hours_spgist_idx ON public.opening_hours USING spgist (hours);
CREATE INDEX photo_xref_photo_id_idx ON public.photo_xref USING btree (photo_id);
CREATE INDEX photo_xref_restaurant_id_idx ON public.photo_xref USING btree (restaurant_id);
CREATE INDEX restaurant_id_ordered_index ON public.restaurant USING btree (id);
CREATE INDEX restaurant_rating_index ON public.restaurant USING btree (rating DESC NULLS LAST);
CREATE INDEX restaurant_sources_index ON public.restaurant USING gin (sources jsonb_path_ops);
CREATE INDEX restaurant_tag_names_trgm_idx ON public.restaurant USING gin (tag_names);
CREATE INDEX restaurant_tag_restaurant_id_idx ON public.restaurant_tag USING btree (restaurant_id);
CREATE INDEX restaurant_trgm_idx ON public.restaurant USING gin (name public.gin_trgm_ops);
CREATE UNIQUE INDEX review_native_data_unique_constraint ON public.review USING btree (user_id, restaurant_id, tag_id) WHERE (user_id <> '00000000-0000-0000-0000-000000000001'::uuid);
CREATE INDEX review_newest_idx ON public.review USING btree (restaurant_id, authored_at DESC NULLS LAST);
CREATE INDEX review_restaurant_id_idx ON public.review USING btree (restaurant_id);
CREATE INDEX review_tag_review_id_idx ON public.review_tag_sentence USING btree (review_id);
CREATE INDEX review_text_gin_trgm_idx ON public.review USING gin (text public.gin_trgm_ops);
CREATE INDEX review_user_id_idx ON public.review USING btree (user_id);
CREATE INDEX review_username_idx ON public.review USING btree (username);
CREATE INDEX tag_alternates_gin_idx ON public.tag USING gin (alternates);
CREATE INDEX tag_name_idx ON public.tag USING btree (name);
CREATE INDEX zcta5_wkb_geometry_geom_idx ON public.zcta5 USING gist (wkb_geometry);
CREATE TRIGGER menu_item_trigger BEFORE INSERT OR UPDATE ON public.menu_item FOR EACH ROW EXECUTE FUNCTION public.menu_item_defaults_trigger();
CREATE TRIGGER nhood_triggers BEFORE INSERT OR UPDATE ON public.zcta5 FOR EACH ROW EXECUTE FUNCTION public.nhood_triggers();
CREATE TRIGGER region_triggers BEFORE INSERT OR UPDATE ON public.hrr FOR EACH ROW EXECUTE FUNCTION public.region_triggers();
CREATE TRIGGER review_trigger BEFORE INSERT OR UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.review_defaults_trigger();
CREATE TRIGGER set_public_menu_item_updated_at BEFORE UPDATE ON public.menu_item FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_public_photos_updated_at BEFORE UPDATE ON public.photo FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_photos_updated_at ON public.photo IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_restaurant_updated_at BEFORE UPDATE ON public.restaurant FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_restaurant_updated_at ON public.restaurant IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_review_updated_at BEFORE UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_review_updated_at ON public.review IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_setting_updated_at BEFORE UPDATE ON public.setting FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_setting_updated_at ON public.setting IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER set_public_taxonomy_updated_at BEFORE UPDATE ON public.tag FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
CREATE TRIGGER set_public_user_updated_at BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_user_updated_at ON public."user" IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE TRIGGER t_restaurant_insert BEFORE INSERT ON public.restaurant FOR EACH ROW WHEN (((new.name IS NOT NULL) AND (new.slug IS NULL))) EXECUTE FUNCTION public.set_slug_from_title();
CREATE TRIGGER tag_trigger AFTER INSERT OR UPDATE ON public.tag FOR EACH ROW EXECUTE FUNCTION public.tag_triggers();
CREATE TRIGGER vote_trigger BEFORE INSERT OR UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.review_score_sync();
ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.photo_xref
    ADD CONSTRAINT photos_xref_photos_id_fkey FOREIGN KEY (photo_id) REFERENCES public.photo(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.photo_xref
    ADD CONSTRAINT photos_xref_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.photo_xref
    ADD CONSTRAINT photos_xref_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.restaurant_tag
    ADD CONSTRAINT restaurant_taxonomy_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.restaurant_tag
    ADD CONSTRAINT restaurant_taxonomy_taxonomy_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.review_tag_sentence
    ADD CONSTRAINT review_tag_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.review(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.review_tag_sentence
    ADD CONSTRAINT review_tag_sentence_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.review_tag_sentence
    ADD CONSTRAINT review_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.tag(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.tag_tag
    ADD CONSTRAINT tag_tag_category_tag_id_fkey FOREIGN KEY (category_tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.tag_tag
    ADD CONSTRAINT tag_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
