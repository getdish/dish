# Stage 1: copy/install
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
COPY apps/react-native apps/react-native
RUN yarn install
RUN cd apps/react-native && yarn run build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/apps/react-native

CMD ["./node_modules/.bin/next", "start"]
