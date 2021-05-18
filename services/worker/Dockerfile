FROM registry.fly.io/dish-base

RUN apt-get update > /dev/null \
      && apt-get install -y chromium xvfb curl \
      && apt-get clean

WORKDIR /app/services/worker

COPY services/worker/pin_nodesource /etc/apt/preferences.d/nodesource
ADD services/worker/xvfb-chromium /usr/bin/xvfb-chromium

ENV NODE_ENV=production
CMD ["./entry.sh"]
