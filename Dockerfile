# m1 support
FROM node:16.3.0-buster

WORKDIR /app

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# install yarn
RUN wget -q -O - https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null \
  && echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update >/dev/null \
  && apt-get -qqy --no-install-recommends install yarn \
  && yarn set version berry \
  && apt-get clean

# copy everything needed for install
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
       tsconfig.base.json ava.config.js ./
COPY packages packages
# only services that depend on yarn build for testing
COPY services/crawlers services/crawlers
COPY services/worker services/worker
COPY app app
COPY dsh dsh
COPY etc/dsh_ctl_sh_deps etc/dsh_ctl_sh_deps

RUN yarn build:js

# remove anything here to preserve cache: package.json scripts, ...
# RUN sed -i '/\"scripts\"/,/}/ d; /^$/d' package.json

# so we can deploy/tag on fly
RUN touch ./__noop__
CMD ["tail -f ./__noop__"]
