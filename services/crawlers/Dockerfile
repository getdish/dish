ARG DISH_BASE_VERSION=latest
FROM docker.k8s.dishapp.com/dish/base:$DISH_BASE_VERSION

COPY services/crawlers services/crawlers

RUN yarn install
RUN yarn build

## Stage 2: run
FROM node:12.16.1-buster-slim
COPY --from=0 /app /app

RUN apt-get update && apt-get install -y cron rsyslog curl
ADD services/crawlers/crontab.txt /app/crontab.txt
ADD services/crawlers/entry.sh /app/entry.sh
RUN /usr/bin/crontab /app/crontab.txt

CMD ["/app/entry.sh"]
