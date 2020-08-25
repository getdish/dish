BEGIN;

SELECT decompress_chunk(i.chunk_name) FROM (
  SELECT chunk_name
  FROM timescaledb_information.compressed_chunk_stats
  WHERE compression_status = 'Compressed'
) i

ALTER TABLE scrape SET (timescaledb.compress=false);

END;

