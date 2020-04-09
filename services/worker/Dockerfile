# Stage 1: copy/install
FROM mhart/alpine-node:12.16.1
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin

COPY package.json .
COPY tsconfig.base.json .
COPY packages packages
COPY services/crawlers services/crawlers
COPY services/worker services/worker

RUN yarn install
RUN yarn workspaces run build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/worker

CMD ["node", "_/index.js"]
