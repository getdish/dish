BEGIN;

CREATE TABLE distinct_sources (
  scrape_id       UUID         NOT NULL UNIQUE,
  id_from_source  TEXT         NOT NULL,
  source          TEXT         NOT NULL,
  PRIMARY KEY (scrape_id)
);

END;

