FROM node:16.3.0-buster as chrome

RUN apt-get update > /dev/null \
      && apt-get install -y chromium xvfb curl \
      && apt-get clean

FROM registry.dishapp.com/dish-base

COPY --from=chrome /bin /bin
COPY --from=chrome /etc /etc
COPY --from=chrome /lib /lib
COPY --from=chrome /sbin /sbin
COPY --from=chrome /usr /usr
# may need /var

WORKDIR /app/app

COPY app/pin_nodesource /etc/apt/preferences.d/nodesource
ADD app/xvfb-chromium /usr/bin/xvfb-chromium

ENV NODE_ENV=production

# add psql
RUN apt-get update && apt-get install -y postgresql-client > /dev/null && apt-get clean

WORKDIR /app

COPY .env .env.test .env.production .env.development package.json ava.config.js jest.config.js dsh dsh.ts ./

# copy to get test folders back
COPY packages packages
COPY app app
COPY services services

ARG GIT_BRANCH=""
ARG GIT_COMMIT=""
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT=${GIT_COMMIT}

RUN touch stay_alive
CMD ["tail", "-f", "stay_alive"]
