FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV DOCKER_BUILD=true

COPY package.json .
COPY .yarnrc .
COPY yarn.lock .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .
COPY ava.config.js .
COPY patches patches
COPY bin bin
COPY dish-app dish-app
COPY packages packages
COPY services services

RUN yarn install --frozen-lockfile && yarn cache clean
RUN yarn build

CMD ["true"]
