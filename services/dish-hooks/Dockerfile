ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

WORKDIR /app/services/dish-hooks
RUN yarn  build

WORKDIR /app
# slim it down
# RUN rm -r dish-app
RUN rm -r packages/server
RUN rm -r packages/webpack
RUN rm -r packages/router
RUN rm -r packages/esdx
RUN rm -r services
COPY services/dish-hooks .

WORKDIR /app/services/dish-hooks
RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list
RUN apt-get update && apt-get install -y s3cmd

CMD ["node", "dist/index.js"]
