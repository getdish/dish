ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION
ENV NODE_ENV=production

WORKDIR /app

# try and avoid reinstalls
RUN rm package.json && rm yarn.lock

RUN \
  apt-get update && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages packages
COPY dish-app dish-app
COPY snackui snackui

WORKDIR /app/dish-app

RUN yarn web:build

EXPOSE 4444

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
