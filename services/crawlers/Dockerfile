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

RUN yarn install
RUN yarn build

## Stage 2: run
FROM node:12.16.1-buster-slim
COPY --from=0 /app /app

ADD services/crawlers/crontab.txt /app/crontab.txt
ADD services/crawlers/entry.sh /app/entry.sh
RUN /usr/bin/crontab /app/crontab.txt

CMD ["/root/entry.sh"]
