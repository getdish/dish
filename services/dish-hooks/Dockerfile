ARG DISH_BASE_VERSION=latest
FROM docker.k8s.dishapp.com/dish/base:$DISH_BASE_VERSION

WORKDIR /app/services/dish-hooks
RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list
RUN apt-get update && apt-get -y -t buster-backports install "s3cmd"

CMD ["node", "_/index.js"]
