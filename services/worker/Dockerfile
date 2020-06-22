# Stage 1: copy/install
FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .
COPY packages packages
COPY services/crawlers services/crawlers
COPY services/worker services/worker

RUN yarn install
RUN yarn build

## Stage 2: run
FROM node:12.16.1-buster-slim
COPY --from=0 /app /app
RUN apt-get update && apt-get install -y \
      gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 \
      libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libgbm-dev \
      libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0\
      libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
      libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
      libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
      libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
      ca-certificates fonts-liberation libappindicator1 libnss3 \
      lsb-release xdg-utils wget xvfb
WORKDIR /app/services/worker

COPY services/worker/entry.sh /app/entry.sh
CMD ["/app/entry.sh"]
