# m1 support
FROM node:16.3.0-buster

WORKDIR /app

ARG GIT_BRANCH=""
ARG GIT_COMMIT=""
ENV GIT_BRANCH=${GIT_BRANCH}
ENV GIT_COMMIT=${GIT_COMMIT}

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# install yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null \
  && echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update >/dev/null \ 
  && apt-get -qqy --no-install-recommends install yarn \
  && yarn set version berry \
  && apt-get clean

# copy everything
COPY snackui snackui
COPY app app
COPY services services
COPY packages packages
COPY package.json .

RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

COPY .yarnrc.yml yarn.lock ./
COPY .yarn .yarn
COPY patches patches
COPY bin bin
COPY app/etc app/etc

# install
RUN yarn install --immutable-cache \
  && yarn postinstall \
  && yarn cache clean

COPY tsconfig.json tsconfig.build.json \
      tsconfig.base.parent.json tsconfig.base.json ava.config.js ./
COPY packages packages
# only services that depend on yarn build for testing
COPY services/crawlers services/crawlers
COPY services/hooks services/hooks
COPY services/worker services/worker
COPY app app
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

RUN yarn build:js
# \
  # remove package.json scripts
  # && sed -i '/\"scripts\"/,/}/ d; /^$/d' package.json

# so we can deploy/tag on fly
RUN touch ./__noop__
CMD ["tail -f ./__noop__"]
