FROM node:15.10.0-buster
WORKDIR /app

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# copy everything
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui
COPY package.json .

RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

FROM node:15.10.0-buster
WORKDIR /app
COPY --from=0 /app .

COPY .yarnrc.yml yarn.lock ./
COPY .yarn .yarn
COPY patches patches
COPY bin bin
COPY dish-app/etc dish-app/etc

# install
RUN yarn install --immutable-cache \
  && yarn cache clean \
  && yarn patch-package \
  && rm .yarn/install-state.gz

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
    -name "jest.config.js" \
    -o -name "ava.config.js" \
    -o -name "*.md" \
    -o -name "*.jpg" \
  \) -print | xargs rm -rf \
  # link in esdx bugfix
  && ln -s /app/packages/esdx/esdx.js /app/node_modules/.bin/esdx

# its potentially fine to remove this one (and the RUN above)
# since it takes a long time on rebuilds (copy whole app)
# but rebuilds are now pretty fast
FROM node:15.10.0-buster
WORKDIR /app
COPY --from=1 /app .

RUN yarn build:js

# so we can deploy/tag on fly
RUN touch ./__noop__
CMD ["tail -f ./__noop__"]
