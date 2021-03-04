ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION
ENV NODE_ENV=test

WORKDIR /app

COPY package.json ./
COPY packages packages
COPY dish-app dish-app
COPY snackui snackui
COPY services services

CMD ["true"]
