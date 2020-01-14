# Base Dish Docker image from which others can inherit
FROM mhart/alpine-node:12
WORKDIR /app

COPY package.json .
COPY lerna.json .
COPY tsconfig.base.json .

# copy monorepo dependencies
COPY packages packages

RUN yarn install
RUN yarn workspaces run build
