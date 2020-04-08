# Stage 1: copy/install
FROM mhart/alpine-node:12.16
WORKDIR /app

COPY package.json .
COPY tsconfig.base.json .

# copy monorepo dependencies
COPY packages packages

RUN apk add python build-base alpine-sdk \
      pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev
RUN yarn install
RUN yarn workspaces run build

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
WORKDIR /app
COPY apps/web apps/web
RUN yarn global add expo-cli
RUN cd apps/web && yarn install
RUN cd apps/web && yarn build:web

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/apps/web

CMD ["yarn", "start:web:prod"]
