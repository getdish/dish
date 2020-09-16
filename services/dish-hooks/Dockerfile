ARG DISH_BASE_VERSION=latest
FROM docker.k8s.dishapp.com/dish/base:$DISH_BASE_VERSION

COPY services/dish-hooks services/dish-hooks

RUN yarn install
RUN yarn build

FROM mhart/alpine-node:slim-12
COPY --from=0 /app /app
WORKDIR /app/services/dish-hooks

CMD ["node", "_/index.js"]
