# for running tests in on ci

ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION as base
ENV NODE_ENV=test

WORKDIR /app

COPY package.json ava.config.js jest.config.js ./

# copy once to get built files

COPY --from=base packages packages
COPY --from=base dish-app dish-app
COPY --from=base snackui snackui
COPY --from=base services services

# copy twice to get test folders back

COPY packages packages
COPY dish-app dish-app
COPY snackui snackui
COPY services services

CMD ["true"]
