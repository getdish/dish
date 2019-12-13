# Stage 1 - the build process
FROM node:10 as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM node:10-alpine
LABEL description="Dashboard to monitor and manage Orkid task queue"
LABEL maintainer="Mehdi Hasan Khan <mhasan@omicronlab.com> (https://about.me/mehdi.hasan.khan)"
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/package*.json ./
COPY --from=build-deps /usr/src/app/build ./build
COPY --from=build-deps /usr/src/app/bin ./bin
COPY --from=build-deps /usr/src/app/index.js ./
COPY --from=build-deps /usr/src/app/README.md ./
COPY --from=build-deps /usr/src/app/LICENSE ./
RUN npm i --only=production

RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3100
CMD ["node", "_/index.js"]
