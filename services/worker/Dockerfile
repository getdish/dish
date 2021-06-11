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

WORKDIR /app/services/worker

COPY services/worker/pin_nodesource /etc/apt/preferences.d/nodesource
ADD services/worker/xvfb-chromium /usr/bin/xvfb-chromium

ENV NODE_ENV=production
CMD ["./entry.sh"]
