# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:15.10.0-buster
WORKDIR /app

# quiet apt-get
ENV DEBIAN_FRONTEND noninteractive
RUN echo 'Dpkg::Use-Pty "0";' > /etc/apt/apt.conf.d/00usepty

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
  && rm .yarn/install-state.gz

COPY tsconfig.json tsconfig.build.json \
  tsconfig.base.parent.json tsconfig.base.json ava.config.js ./
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui

# remove all tests even node modules
RUN find . -type d \(  -name "test" -o -name "tests"  \) -print | xargs rm -rf && \
  find . -type f \(  -name "*.md" -o -name "*.jpg"  \) -print | xargs rm -rf && \
  # link in esdx bugfix
  ln -s /app/packages/esdx/etc/esdx.js /app/node_modules/.bin/esdx

RUN yarn build

CMD ["true"]
