FROM mcr.microsoft.com/playwright:bionic

COPY package.json .
RUN npm install
COPY src src
RUN npm install -g pm2
RUN npm run build:skip-types

# ENV DEBUG=pw:api

CMD ["pm2-dev", "dist/index.js", "--watch", "--max-memory-restart", "2G"]
