# fly workaround, before running timescale mount to /data and run this:
# FROM node:15.10.0-buster
# CMD ["rm", "-r", "/data/lost+found"]

FROM timescale/timescaledb-postgis:1.7.2-pg12

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=scrape_data

COPY docker-entrypoint-initdb.d/* /docker-entrypoint-initdb.d/

