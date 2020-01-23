# Stage 1: copy/install
# Base Dish Docker image from which others can inherit
FROM mhart/alpine-node:12
WORKDIR /app

COPY package.json .
COPY tsconfig.base.json .

# copy monorepo dependencies
COPY packages packages

RUN yarn install
RUN yarn workspaces run build

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
WORKDIR /app
COPY services/crawlers services/crawlers
RUN yarn install
RUN cd services/crawlers && yarn build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/crawlers

CMD ["node", "_/index.js"]
