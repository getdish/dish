# for running tests in on ci

# start from worker so we have chrome installed
FROM registry.dishapp.com/dish-worker:latest

# add psql
RUN apt-get update && apt-get install -y postgresql-client > /dev/null && apt-get clean

WORKDIR /app

COPY .env .env.test .env.production .env.development package.json ava.config.js jest.config.js dsh dsh.ts ./

# copy to get test folders back

COPY packages packages
COPY app app
COPY services services
COPY snackui snackui

ENV DISH_ENV=test
ENV NODE_ENV=test
ENV POSTGRES_DB=test
ENV CI=true

RUN node --version

RUN touch stay_alive
CMD ["tail", "-f", "stay_alive"]
