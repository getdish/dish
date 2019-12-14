# Stage 1: copy/install

FROM mhart/alpine-node:12
WORKDIR /app

COPY package.json .

# copy service
COPY services/crawlers ./services/crawlers
# copy monorepo dependencies
COPY packages/crawler ./packages/crawler

RUN yarn install --production --no-scripts


# Stage 2: run

FROM mhart/alpine-node:slim-12
WORKDIR /app
COPY --from=0 /app .

WORKDIR /app/services/crawlers
CMD ["node", "_/index.js"]
