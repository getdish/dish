FROM timescale/timescaledb-postgis:2.3.0-pg12

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

ENV TS_TUNE_MAX_CONNS=300

COPY docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/
