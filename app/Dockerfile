FROM registry.dishapp.com/dish-base:latest

RUN \
  apt-get update >/dev/null && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch > /dev/null \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

FROM registry.dishapp.com/dish-base:latest
COPY --from=0 /bin /usr/local/bin
ENV NODE_ENV=production

# avoid rebuilds
RUN rm -r services && rm -r packages/worker

WORKDIR /app

COPY yarn.lock .yarnrc.yml ./
COPY packages packages
COPY app app

WORKDIR /app/app

RUN npm run web:build

EXPOSE 4444

CMD ["npm", "run", "web:serve"]
