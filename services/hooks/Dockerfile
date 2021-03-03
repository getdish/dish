ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update && apt-get install -y s3cmd && apt-get clean

WORKDIR /app/services/dish-hooks

CMD ["node", "dist/index.js"]
