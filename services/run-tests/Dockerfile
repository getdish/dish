# for running tests in on ci

FROM registry.fly.io/dish-base:latest

WORKDIR /app

COPY .env .env.test package.json ava.config.js jest.config.js dishctl.sh ./

# copy to get test folders back

COPY packages packages
COPY dish-app dish-app
COPY services services
COPY snackui snackui

ENV NODE_ENV=test
ENV POSTGRES_DB=test
ENV CI=true

RUN touch stay_alive
CMD ["tail", "-f", "stay_alive"]
