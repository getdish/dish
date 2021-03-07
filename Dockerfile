FROM node:15.10.0-buster
WORKDIR /app

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV DOCKER_BUILD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# copy everything
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui
COPY package.json .

RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

COPY .yarnrc.yml .
COPY yarn.lock .
COPY .yarn .yarn
COPY patches patches
COPY bin bin
COPY dish-app/etc dish-app/etc

# install
RUN yarn install --immutable-cache \
  && yarn cache clean \
  && rm .yarn/install-state.gz \
  && yarn patch-package

RUN ls -la .yarn

COPY tsconfig.json tsconfig.build.json \
  tsconfig.base.parent.json tsconfig.base.json ava.config.js ./
COPY packages packages
# only services that depend on yarn build for testing
COPY services/crawlers services/crawlers
COPY services/hooks services/hooks
COPY services/worker services/worker
COPY dish-app dish-app
COPY snackui snackui

# remove all tests even node modules
RUN find . -type d \(  -name "test" -o -name "tests"  \) -print | xargs rm -rf && \
  find . -type f \( \
    -name "jest.config.js" -o -name "ava.config.js" \
    -o -name "*.md" -o -name "*.jpg" \
  \) -print | xargs rm -rf \
  # link in esdx bugfix
  && ln -s /app/packages/esdx/esdx.js /app/node_modules/.bin/esdx

RUN ls -la snackui/packages/snackui-static

RUN yarn build:js

CMD ["true"]
