FROM timescale/timescaledb-postgis:1.7.2-pg12

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=scrape_data

ENV TS_TUNE_MAX_CONNS=300

COPY docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/

