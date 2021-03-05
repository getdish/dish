# STEP 1
# everything that goes into deterministic yarn goes on this step

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
  && yarn patch-package \
  && (cd dish-app && yarn patch-package)

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
  find . -type f \(  -name "*.md" -o -name "*.jpg"  \) -print | xargs rm -rf && \
  # link in esdx bugfix
  ln -s /app/packages/esdx/esdx.js /app/node_modules/.bin/esdx

RUN JS_ONLY=1 yarn build

CMD ["true"]
