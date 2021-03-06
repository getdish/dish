# for running tests in on ci

FROM gcr.io/dish-258800/base
ENV NODE_ENV=test

WORKDIR /app

COPY package.json ava.config.js jest.config.js ./

# copy to get test folders back

COPY packages packages
COPY dish-app dish-app
COPY snackui snackui
COPY services services

CMD ["true"]
