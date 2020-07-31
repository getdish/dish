BEGIN;

SELECT create_hypertable('scrape', 'time');

ALTER TABLE scrape SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'source'
);

SELECT add_compress_chunks_policy('scrape', INTERVAL '1 hour');

END;
