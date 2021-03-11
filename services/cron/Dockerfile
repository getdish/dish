FROM node:15.10.0-buster

RUN apt-get update > /dev/null && apt-get install -y lsb-release > /dev/null && \
      echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
      wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
      echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update > /dev/null && \
      apt-get install -y s3cmd > /dev/null && \
      apt-get install -y cron curl postgresql-client-12 > /dev/null && \
      apt-get clean

FROM registry.fly.io/dish-base:latest
COPY --from=0 /bin /bin
COPY --from=0 /usr/bin /usr/bin

WORKDIR /app

COPY dishctl.sh .
COPY services/cron services/cron

WORKDIR /app/services/cron

CMD ["/app/services/cron/entry.sh"]
