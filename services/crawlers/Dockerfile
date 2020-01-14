# Stage 1: copy/install
FROM dish/base

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
WORKDIR /app
COPY . services/crawlers
RUN yarn install
RUN cd services/crawlers && yarn build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/crawlers

CMD ["node", "_/index.js"]
