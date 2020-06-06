# Stage 1: copy/install
FROM mhart/alpine-node:12.16.1
WORKDIR /app
RUN apk add --no-cache patch
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .

COPY packages packages
COPY services/jwt-server services/jwt-server

RUN yarn install
RUN yarn build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/jwt-server

CMD ["node", "_/index.js"]
