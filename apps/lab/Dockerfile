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
COPY apps/lab apps/lab
RUN yarn install
RUN cd apps/lab && react-scripts build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/apps/lab

CMD ["./node_modules/.bin/serve", "--single", "build"]
