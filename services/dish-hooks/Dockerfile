ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

# slim it down a lot
RUN rm -r dish-app

WORKDIR /app/services/dish-hooks
RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list
RUN apt-get update && apt-get -y -t buster-backports install "s3cmd"

CMD ["node", "dist/index.js"]
