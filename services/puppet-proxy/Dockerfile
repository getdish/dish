FROM mcr.microsoft.com/playwright:bionic

COPY package.json .
RUN npm install
COPY src src
RUN npm install -g nodemon
RUN npm run build:skip-types

# ENV DEBUG=pw:api

CMD ["nodemon", "--watch", "dist/*", "dist/index.js"]
