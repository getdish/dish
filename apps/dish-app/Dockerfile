ARG DISH_BASE_VERSION=latest
FROM docker.k8s.dishapp.com/dish/base:$DISH_BASE_VERSION

RUN apt-get update && apt-get install -y parallel build-essential \
      libcairo2-dev libpixman-1-dev libpango1.0-dev \
      libjpeg62-turbo-dev libgif-dev patch

COPY apps/dish-app apps/dish-app

RUN yarn install
RUN yarn build

WORKDIR /app/apps/dish-app
RUN yarn build:web

## Slim it
FROM node:12.16.1-buster-slim
COPY --from=0 /app /app
WORKDIR /app/apps/dish-app
RUN apt-get update && apt-get install -y \
      libpixman-1.0 libcairo2 libpango1.0-0 libjpeg62-turbo libgif7

CMD ["node", "_/web/server.js"]
