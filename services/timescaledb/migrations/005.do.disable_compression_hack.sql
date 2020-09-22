BEGIN;

SELECT remove_compress_chunks_policy('scrape');
SELECT add_compress_chunks_policy('scrape', INTERVAL '100 years');

END;

