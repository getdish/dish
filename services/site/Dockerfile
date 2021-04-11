FROM registry.fly.io/dish-base:latest

RUN \
  apt-get update >/dev/null && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch > /dev/null \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /app/services/site

COPY services/site/public public
COPY services/site/src src
COPY services/site/webpack.config.js webpack.config.js

RUN yarn build:prod

EXPOSE 3999

CMD ["yarn", "serve"]
