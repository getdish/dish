FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"

COPY package.json .
COPY .yarnrc .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .

COPY services/dish-hooks services/dish-hooks

RUN yarn install
RUN yarn build

FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/dish-hooks

CMD ["node", "_/index.js"]
