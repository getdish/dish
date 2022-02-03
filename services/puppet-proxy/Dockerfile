FROM mcr.microsoft.com/playwright:bionic

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD true

COPY package.json .
RUN npm install
COPY src src
RUN npm install -g pm2
RUN npm run build

# ENV DEBUG=pw:api

CMD ["pm2-runtime", "dist/index.js", "--max-memory-restart", "6G"]
