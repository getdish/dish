BEGIN;

SELECT create_hypertable('scrape', 'time');

ALTER TABLE scrape SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'source'
);

END;
