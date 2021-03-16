BEGIN;

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE scrape (
  id              UUID         DEFAULT uuid_generate_v4(),
  time            TIMESTAMPTZ  NOT NULL,
  location        GEOMETRY     NULL,
  restaurant_id   UUID         NULL,
  data            JSONB        NOT NULL,
  source          TEXT         NOT NULL,
  id_from_source  TEXT         NOT NULL
);

END;
