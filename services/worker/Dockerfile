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

ARG GIT_BRANCH=""
ARG GIT_COMMIT=""
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT=${GIT_COMMIT}

CMD ["yarn", "worker:start"]
