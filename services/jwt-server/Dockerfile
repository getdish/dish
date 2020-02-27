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
COPY services/jwt-server services/jwt-server
RUN yarn install
RUN cd services/jwt-server && yarn build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/jwt-server

CMD ["node", "_/index.js"]
