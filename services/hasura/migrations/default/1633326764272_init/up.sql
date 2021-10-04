SET check_function_bodies = false;
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
    slug text,
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
    oldest_review_date timestamp with time zone,
    og_source_ids jsonb,
    scrape_metadata jsonb,
    is_out_of_business boolean,
    external_source_info jsonb
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
CREATE TABLE public.list (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    description text,
    slug text DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    color integer,
    public boolean DEFAULT true NOT NULL,
    location public.geometry,
    region text,
    theme integer DEFAULT 0 NOT NULL,
    image text,
    font integer DEFAULT 0
);
CREATE FUNCTION public.list_populated(min_items integer) RETURNS SETOF public.list
    LANGUAGE sql STABLE
    AS $$
    SELECT *
    FROM list 
    WHERE id IN (SELECT list_id
               FROM list_restaurant
               GROUP BY list_id HAVING COUNT(*) >= min_items)
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
    slug text,
    default_image text
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
CREATE FUNCTION public.restaurant_new(region_slug text) RETURNS SETOF public.restaurant
    LANGUAGE sql STABLE
    AS $$
SELECT * FROM restaurant
    WHERE ST_Within(
      location,
      ST_SetSRID(
        (
          SELECT coalesce(
            (SELECT wkb_geometry FROM zcta5 WHERE slug = region_slug),
            (SELECT wkb_geometry FROM hrr WHERE slug = region_slug)
          )
        ),
        0
      )
    )
    ORDER BY oldest_review_date desc
    LIMIT 15
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
CREATE FUNCTION public.restaurant_trending(region_slug text) RETURNS SETOF public.restaurant
    LANGUAGE sql STABLE
    AS $$
WITH restaurants_in_region AS (
  SELECT * FROM restaurant
    WHERE ST_Within(
      location,
      ST_SetSRID(
        (
          SELECT coalesce(
            (SELECT wkb_geometry FROM zcta5 WHERE slug = region_slug),
            (SELECT wkb_geometry FROM hrr WHERE slug = region_slug)
          )
        ),
        0
      )
    )
    ORDER BY updated_at DESC
    LIMIT 10000
),
trending_restaurants_in_region AS (
    SELECT COUNT(restaurant_id) as count, restaurants_in_region.id
      FROM review
      JOIN restaurants_in_region ON restaurant_id = restaurants_in_region.id
        WHERE authored_at > now() - interval '12 months'
        AND review.rating >= 4
      GROUP BY restaurants_in_region.id
      ORDER BY count DESC
      LIMIT 15
)
SELECT restaurant.* from restaurant
  JOIN trending_restaurants_in_region ON restaurant.id = trending_restaurants_in_region.id
  ORDER BY trending_restaurants_in_region.count
  LIMIT 15
$$;
CREATE FUNCTION public.restaurant_with_tags(tag_slugs text) RETURNS SETOF public.restaurant
    LANGUAGE sql STABLE
    AS $$
    SELECT r.* FROM restaurant r
        INNER JOIN restaurant_tag rt on rt.restaurant_id = r.id
        INNER JOIN tag t on t.id = rt.tag_id
        WHERE t.slug IN (SELECT * FROM (SELECT UNNEST(string_to_array(tag_slugs, ','))) as tsa)
        ORDER BY rt.score DESC
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
  IF EXISTS (SELECT FROM restaurant WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT FROM restaurant WHERE slug = standard) THEN
    IF EXISTS (SELECT FROM restaurant WHERE slug = with_city) THEN
      IF EXISTS (SELECT FROM restaurant WHERE slug = with_address) THEN
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
CREATE FUNCTION public.set_slug_from_title_updateable() RETURNS trigger
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
  IF NEW."slug" IS NULL THEN
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
  END IF;
  RETURN NEW;
END
$$;
CREATE TABLE public.account (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(60) NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.account_user_id_seq OWNED BY public.account.user_id;
CREATE TABLE public.event (
    event_id integer NOT NULL,
    website_id integer NOT NULL,
    session_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    url character varying(500) NOT NULL,
    event_type character varying(50) NOT NULL,
    event_value character varying(50) NOT NULL
);
CREATE SEQUENCE public.event_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.event_event_id_seq OWNED BY public.event.event_id;
CREATE TABLE public.follow (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    follower_id uuid NOT NULL,
    following_id uuid NOT NULL
);
CREATE TABLE public.hrr (
    ogc_fid integer NOT NULL,
    hrrcity character varying,
    wkb_geometry public.geometry(Geometry,4326),
    slug text,
    color text
);
CREATE SEQUENCE public.hrr_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.hrr_ogc_fid_seq OWNED BY public.hrr.ogc_fid;
CREATE TABLE public.list_region (
    restaurant_id uuid NOT NULL,
    list_id uuid NOT NULL,
    region text NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL
);
CREATE TABLE public.list_restaurant (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    restaurant_id uuid NOT NULL,
    list_id uuid NOT NULL,
    comment text,
    "position" integer,
    user_id uuid NOT NULL
);
CREATE TABLE public.list_restaurant_tag (
    id uuid NOT NULL,
    list_id uuid NOT NULL,
    list_restaurant_id uuid NOT NULL,
    restaurant_tag_id uuid NOT NULL,
    "position" integer NOT NULL,
    user_id uuid NOT NULL
);
CREATE TABLE public.list_tag (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    list_id uuid NOT NULL,
    tag_id uuid NOT NULL
);
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
CREATE TABLE public.pageview (
    view_id integer NOT NULL,
    website_id integer NOT NULL,
    session_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    url character varying(500) NOT NULL,
    referrer character varying(500)
);
CREATE SEQUENCE public.pageview_view_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pageview_view_id_seq OWNED BY public.pageview.view_id;
CREATE TABLE public.photo (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    url text,
    quality numeric,
    origin text,
    categories jsonb,
    user_id uuid
);
CREATE TABLE public.photo_xref (
    photo_id uuid NOT NULL,
    restaurant_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    type text,
    review_id uuid,
    user_id uuid
);
CREATE TABLE public.review (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    restaurant_id uuid,
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
    type text,
    list_id uuid
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
CREATE TABLE public.session (
    session_id integer NOT NULL,
    session_uuid uuid NOT NULL,
    website_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    hostname character varying(100),
    browser character varying(20),
    os character varying(20),
    device character varying(20),
    screen character varying(11),
    language character varying(35),
    country character(2)
);
CREATE SEQUENCE public.session_session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.session_session_id_seq OWNED BY public.session.session_id;
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
    password_reset_date timestamp with time zone,
    name text
);
CREATE TABLE public.website (
    website_id integer NOT NULL,
    website_uuid uuid NOT NULL,
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    domain character varying(500),
    share_id character varying(64),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
CREATE SEQUENCE public.website_website_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.website_website_id_seq OWNED BY public.website.website_id;
CREATE TABLE public.zcta5 (
    ogc_fid integer NOT NULL,
    intptlat10 character varying,
    intptlon10 character varying,
    wkb_geometry public.geometry(Geometry,4326),
    nhood text,
    slug text,
    color text
);
CREATE SEQUENCE public.zcta5_ogc_fid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.zcta5_ogc_fid_seq OWNED BY public.zcta5.ogc_fid;
ALTER TABLE ONLY public.account ALTER COLUMN user_id SET DEFAULT nextval('public.account_user_id_seq'::regclass);
ALTER TABLE ONLY public.event ALTER COLUMN event_id SET DEFAULT nextval('public.event_event_id_seq'::regclass);
ALTER TABLE ONLY public.hrr ALTER COLUMN ogc_fid SET DEFAULT nextval('public.hrr_ogc_fid_seq'::regclass);
ALTER TABLE ONLY public.pageview ALTER COLUMN view_id SET DEFAULT nextval('public.pageview_view_id_seq'::regclass);
ALTER TABLE ONLY public.session ALTER COLUMN session_id SET DEFAULT nextval('public.session_session_id_seq'::regclass);
ALTER TABLE ONLY public.tag ALTER COLUMN "order" SET DEFAULT nextval('public.taxonomy_order_seq1'::regclass);
ALTER TABLE ONLY public.website ALTER COLUMN website_id SET DEFAULT nextval('public.website_website_id_seq'::regclass);
ALTER TABLE ONLY public.zcta5 ALTER COLUMN ogc_fid SET DEFAULT nextval('public.zcta5_ogc_fid_seq'::regclass);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (user_id);
ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_username_key UNIQUE (username);
ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (event_id);
ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_follower_id_following_id_key UNIQUE (follower_id, following_id);
ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.hrr
    ADD CONSTRAINT hrr_pkey PRIMARY KEY (ogc_fid);
ALTER TABLE ONLY public.hrr
    ADD CONSTRAINT hrr_slug_key UNIQUE (slug);
ALTER TABLE ONLY public.list
    ADD CONSTRAINT list_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.list_region
    ADD CONSTRAINT list_region_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.list_restaurant
    ADD CONSTRAINT list_restaurant_id_key UNIQUE (id);
ALTER TABLE ONLY public.list_restaurant
    ADD CONSTRAINT list_restaurant_pkey PRIMARY KEY (restaurant_id, list_id);
ALTER TABLE ONLY public.list_restaurant
    ADD CONSTRAINT list_restaurant_position_list_id_key UNIQUE ("position", list_id);
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_id_key UNIQUE (id);
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_list_id_list_restaurant_id_restaurant_tag_i UNIQUE (list_id, list_restaurant_id, restaurant_tag_id);
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_position_list_id_list_restaurant_id_key UNIQUE ("position", list_id, list_restaurant_id);
ALTER TABLE ONLY public.list
    ADD CONSTRAINT list_slug_user_id_region_key UNIQUE (slug, user_id, region);
ALTER TABLE ONLY public.list_tag
    ADD CONSTRAINT list_tag_list_id_tag_id_id_key UNIQUE (list_id, tag_id, id);
ALTER TABLE ONLY public.list_tag
    ADD CONSTRAINT list_tag_pkey PRIMARY KEY (id);
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
ALTER TABLE ONLY public.pageview
    ADD CONSTRAINT pageview_pkey PRIMARY KEY (view_id);
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
    ADD CONSTRAINT restaurant_tag_id_restaurant_id_pkey UNIQUE (tag_id, restaurant_id);
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
    ADD CONSTRAINT review_user_id_restaurant_id_list_id_type_key UNIQUE (user_id, restaurant_id, list_id, type);
ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_username_restauarant_id_tag_id_type_key UNIQUE (username, restaurant_id, tag_id, type);
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_id);
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_session_uuid_key UNIQUE (session_uuid);
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
ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_pkey PRIMARY KEY (website_id);
ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_share_id_key UNIQUE (share_id);
ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_website_uuid_key UNIQUE (website_uuid);
ALTER TABLE ONLY public.zcta5
    ADD CONSTRAINT zcta5_pkey PRIMARY KEY (ogc_fid);
ALTER TABLE ONLY public.zcta5
    ADD CONSTRAINT zcta5_slug_key UNIQUE (slug);
CREATE INDEX dish_name_trgm_idx ON public.menu_item USING gin (name public.gin_trgm_ops);
CREATE INDEX event_created_at_idx ON public.event USING btree (created_at);
CREATE INDEX event_session_id_idx ON public.event USING btree (session_id);
CREATE INDEX event_website_id_idx ON public.event USING btree (website_id);
CREATE INDEX hrr_wkb_geometry_geom_idx ON public.hrr USING gist (wkb_geometry);
CREATE INDEX menu_item_description_trgm_idx ON public.menu_item USING gin (description public.gin_trgm_ops);
CREATE INDEX menu_item_restaurant_id_idx ON public.menu_item USING btree (restaurant_id);
CREATE INDEX opening_hours_restaurant_id_idx ON public.opening_hours USING btree (restaurant_id);
CREATE INDEX opening_hours_spgist_idx ON public.opening_hours USING spgist (hours);
CREATE INDEX pageview_created_at_idx ON public.pageview USING btree (created_at);
CREATE INDEX pageview_session_id_idx ON public.pageview USING btree (session_id);
CREATE INDEX pageview_website_id_created_at_idx ON public.pageview USING btree (website_id, created_at);
CREATE INDEX pageview_website_id_idx ON public.pageview USING btree (website_id);
CREATE INDEX pageview_website_id_session_id_created_at_idx ON public.pageview USING btree (website_id, session_id, created_at);
CREATE INDEX photo_id_ordered_idx ON public.photo USING btree (id);
CREATE INDEX photo_xref_photo_id_idx ON public.photo_xref USING btree (photo_id);
CREATE INDEX photo_xref_restaurant_id_idx ON public.photo_xref USING btree (restaurant_id);
CREATE INDEX restaurant_id_ordered_index ON public.restaurant USING btree (id);
CREATE INDEX restaurant_location_geo ON public.restaurant USING gist (location);
CREATE INDEX restaurant_rating_index ON public.restaurant USING btree (rating DESC NULLS LAST);
CREATE INDEX restaurant_slug_trgm_idx ON public.restaurant USING gin (slug public.gin_trgm_ops);
CREATE INDEX restaurant_sources_index ON public.restaurant USING gin (sources jsonb_path_ops);
CREATE INDEX restaurant_tag_names_trgm_idx ON public.restaurant USING gin (tag_names);
CREATE INDEX restaurant_tag_restaurant_id_idx ON public.restaurant_tag USING btree (restaurant_id);
CREATE INDEX restaurant_trgm_idx ON public.restaurant USING gin (name public.gin_trgm_ops);
CREATE INDEX review_list_id_idx ON public.review USING btree (list_id);
CREATE UNIQUE INDEX review_native_data_unique_constraint ON public.review USING btree (user_id, restaurant_id, tag_id) WHERE (user_id <> '00000000-0000-0000-0000-000000000001'::uuid);
CREATE INDEX review_newest_idx ON public.review USING btree (restaurant_id, authored_at DESC NULLS LAST);
CREATE INDEX review_restaurant_favorited_type ON public.review USING btree (favorited, type);
CREATE INDEX review_restaurant_id_idx ON public.review USING btree (restaurant_id);
CREATE INDEX review_tag_review_id_idx ON public.review_tag_sentence USING btree (review_id);
CREATE INDEX review_text_gin_trgm_idx ON public.review USING gin (text public.gin_trgm_ops);
CREATE INDEX review_user_id_idx ON public.review USING btree (user_id);
CREATE INDEX review_username_idx ON public.review USING btree (username);
CREATE INDEX session_created_at_idx ON public.session USING btree (created_at);
CREATE INDEX session_website_id_idx ON public.session USING btree (website_id);
CREATE INDEX tag_alternates_gin_idx ON public.tag USING gin (alternates);
CREATE INDEX tag_name_idx ON public.tag USING btree (name);
CREATE INDEX tag_type_idx ON public.tag USING btree (type);
CREATE INDEX tmp_updated_at_order ON public.restaurant USING btree (updated_at DESC NULLS LAST);
CREATE INDEX website_user_id_idx ON public.website USING btree (user_id);
CREATE INDEX zcta5_wkb_geometry_geom_idx ON public.zcta5 USING gist (wkb_geometry);
CREATE TRIGGER menu_item_trigger BEFORE INSERT OR UPDATE ON public.menu_item FOR EACH ROW EXECUTE FUNCTION public.menu_item_defaults_trigger();
CREATE TRIGGER nhood_triggers BEFORE INSERT OR UPDATE ON public.zcta5 FOR EACH ROW EXECUTE FUNCTION public.nhood_triggers();
CREATE TRIGGER region_triggers BEFORE INSERT OR UPDATE ON public.hrr FOR EACH ROW EXECUTE FUNCTION public.region_triggers();
CREATE TRIGGER review_trigger BEFORE INSERT OR UPDATE ON public.review FOR EACH ROW EXECUTE FUNCTION public.review_defaults_trigger();
CREATE TRIGGER set_public_list_updated_at BEFORE UPDATE ON public.list FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_list_updated_at ON public.list IS 'trigger to set value of column "updated_at" to current timestamp on row update';
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
ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.session(session_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.website(website_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.follow
    ADD CONSTRAINT follow_following_id_fkey FOREIGN KEY (following_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant
    ADD CONSTRAINT list_restaurant_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.list(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant
    ADD CONSTRAINT list_restaurant_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.list(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_list_restaurant_id_fkey FOREIGN KEY (list_restaurant_id) REFERENCES public.list_restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_tag_id_fkey FOREIGN KEY (restaurant_tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant_tag
    ADD CONSTRAINT list_restaurant_tag_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.list_restaurant
    ADD CONSTRAINT list_restaurant_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.menu_item
    ADD CONSTRAINT menu_item_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_restaurant_id_fkey FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.pageview
    ADD CONSTRAINT pageview_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.session(session_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.pageview
    ADD CONSTRAINT pageview_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.website(website_id) ON DELETE CASCADE;
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
ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.website(website_id) ON DELETE CASCADE;
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT "tag_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public.tag(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.tag_tag
    ADD CONSTRAINT tag_tag_category_tag_id_fkey FOREIGN KEY (category_tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.tag_tag
    ADD CONSTRAINT tag_tag_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.website
    ADD CONSTRAINT website_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.account(user_id) ON DELETE CASCADE;
