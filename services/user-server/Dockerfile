ARG DISH_BASE_VERSION=latest
FROM docker.k8s.dishapp.com/dish/base:$DISH_BASE_VERSION

COPY services/user-server services/user-server

RUN yarn install
RUN yarn build

## Stage 2: run
FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/user-server

CMD ["node", "_/index.js"]
