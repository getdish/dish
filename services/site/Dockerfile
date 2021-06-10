FROM debian:bullseye-20210511

RUN \
  apt-get update >/dev/null && apt-get install -y parallel build-essential > /dev/null \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

FROM registry.dishapp.com/dish-base:latest
COPY --from=0 /bin /usr/local/bin

WORKDIR /app/services/site
ENV NODE_ENV=production

COPY services/site/public public
COPY services/site/src src
COPY services/site/webpack.config.js webpack.config.js

RUN yarn build:prod

EXPOSE 3999

CMD ["yarn", "serve"]
