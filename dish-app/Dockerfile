ARG DISH_BASE_VERSION=latest

FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION as base

WORKDIR /app/dish-app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y parallel build-essential \
      libcairo2-dev libpixman-1-dev libpango1.0-dev \
      libjpeg62-turbo-dev libgif-dev patch

RUN yarn web:build

# slim it down
RUN rm -r services

FROM node:15.10.0-buster-slim as slim
WORKDIR /app
COPY --from=base /app /app
WORKDIR /app/dish-app

EXPOSE 4444

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
