# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:15.10.0-buster as base
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

# remove most files (only keep stuff for install)
RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

FROM node:15.10.0-buster as install-stage
COPY --from=base /app /app
WORKDIR /app

COPY .yarnrc .
COPY yarn.lock .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc

# install
RUN yarn install --production \
  && yarn cache clean \
   rm -r dish-app/node_modules/jsc-android || true
   rm -r dish-app/node_modules/react-native || true
   rm -r node_modules/jsc-android || true
   rm -r node_modules/hermes-engine || true

COPY .prettierignore .
COPY .prettierrc .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.parent.json .
COPY tsconfig.base.json .
COPY ava.config.js .
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui

RUN (cd packages/esdx && yarn link) && \
  yarn build && \
  rm -r node_modules && yarn install --production --offline

CMD ["true"]
