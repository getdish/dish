ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION

RUN rm -r services

WORKDIR /app/dish-app

RUN \
  apt-get -qq update && apt-get -qq install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

RUN yarn web:build

EXPOSE 4444

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
