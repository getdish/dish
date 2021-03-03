ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

WORKDIR /app

RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update && apt-get install -y s3cmd && \
      apt-get cache clean

COPY /app/services/dish-hooks /app/services/dish-hooks

RUN yarn install

RUN rm -r packages/server && \
      rm -r packages/webpack && \
      rm -r packages/router && \
      rm -r packages/esdx

WORKDIR /app/services/dish-hooks

CMD ["node", "dist/index.js"]
