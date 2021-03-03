ARG DISH_BASE_VERSION=latest

FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION as base

RUN \
  apt-get update && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

WORKDIR /app/dish-app
ENV NODE_ENV=production

RUN yarn web:build

FROM node:15.10.0-buster-slim
WORKDIR /app
COPY --from=base /app/node_modules /app/node_modules
COPY --from=base /app/snackui /app/snackui
COPY --from=base /app/packages /app/packages
COPY --from=base /app/package.json /app/package.json
COPY --from=base /app/dish-app /app/dish-app
WORKDIR /app/dish-app

EXPOSE 4444

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
