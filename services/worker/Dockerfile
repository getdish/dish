FROM node:15.10.0-buster

RUN apt-get update > /dev/null && apt-get install -y \
      gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 \
      libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libgbm-dev \
      libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0\
      libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 \
      libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
      libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
      libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
      ca-certificates fonts-liberation libappindicator1 libnss3 \
      lsb-release xdg-utils wget xvfb procps psmisc htop \
       > /dev/null \
      && apt-get clean

WORKDIR /app
COPY services/worker services/worker
COPY packages packages
WORKDIR /app/services/worker

CMD ["./entry.sh"]
