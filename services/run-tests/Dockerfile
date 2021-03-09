# for running tests in on ci

FROM registry.fly.io/base

WORKDIR /app

COPY package.json ava.config.js jest.config.js ./

# copy to get test folders back

COPY packages packages
COPY dish-app dish-app
COPY snackui snackui
COPY services services

ENV NODE_ENV=test
ENV CI=true

CMD ["true"]
