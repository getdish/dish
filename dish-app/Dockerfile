ARG DISH_BASE_VERSION=latest

FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION as base

RUN apt-get update && apt-get install -y parallel build-essential \
      libcairo2-dev libpixman-1-dev libpango1.0-dev \
      libjpeg62-turbo-dev libgif-dev patch

# slim it down
RUN rm -r services \
      && rm -r packages/react-test-env

WORKDIR /app/dish-app

ENV NODE_ENV=production

RUN yarn web:build

EXPOSE 4444

FROM node:15.10.0-buster-slim as base
WORKDIR /app
COPY --from=base /app/dish-app /app

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
