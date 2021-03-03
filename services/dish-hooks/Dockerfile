ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

WORKDIR /app

RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update && apt-get install -y s3cmd

COPY services/dish-hooks services/dish-hooks

RUN yarn install && yarn build && yarn cache clean

RUN rm -r packages/server && \
      rm -r packages/webpack && \
      rm -r packages/router && \
      rm -r packages/esdx

FROM node:15.10.0-slim as install-stage
COPY --from=base /app /app
WORKDIR /app/services/dish-hooks

CMD ["node", "dist/index.js"]
