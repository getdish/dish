# Stage 1: copy/install
FROM mhart/alpine-node:12.16.1
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"
RUN apk add python bash parallel build-base alpine-sdk \
      pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev patch

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY packages packages
COPY apps/web apps/web

RUN yarn install
RUN yarn build

WORKDIR /app/apps/web
RUN yarn build:web

## Stage 2: run
FROM mhart/alpine-node:slim-12.16.1
COPY --from=0 /app /app
WORKDIR /app/apps/web
RUN apk add pixman cairo pango libjpeg giflib curl bash
RUN touch $HOME/.bashrc
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

CMD ["/root/.yarn/bin/yarn", "start:web:ssr"]
