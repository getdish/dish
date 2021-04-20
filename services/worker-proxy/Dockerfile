FROM mcr.microsoft.com/playwright:bionic

COPY package.json .
RUN npm install
COPY src src
RUN npm run build

# ENV DEBUG=pw:api

CMD ["node", "dist/index.js"]
