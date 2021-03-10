FROM node:15.10.0-buster

RUN \
  apt-get update >/dev/null && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch > /dev/null \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

# docker only caches after copy ?
# COPY package.json package.json

FROM registry.fly.io/dish-base:latest
COPY --from=0 /bin /usr/local/bin
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages packages
COPY dish-app dish-app
COPY snackui snackui

WORKDIR /app/dish-app

RUN npm run web:build

EXPOSE 4444

CMD ["npm", "run", "web:serve"]
