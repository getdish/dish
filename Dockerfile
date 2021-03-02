# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:15.10.0-buster as copy-stage
WORKDIR /app

# for caching
RUN mkdir -p /data/.cache/yarn
RUN yarn config set cache-folder /data/.cache/yarn

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV DOCKER_BUILD=true

# avoid installing puppeteer in base image
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
COPY --from=copy-stage /app /app
WORKDIR /app

COPY yarn.lock .
COPY .yarnrc .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc

# install
RUN yarn install --frozen-lockfile

# clean a bit of native-only deps
RUN rm -r dish-app/node_modules/jsc-android || true
RUN rm -r dish-app/node_modules/react-native || true
RUN rm -r node_modules/jsc-android || true
RUN rm -r node_modules/hermes-engine || true
RUN rm -r node_modules/snowpack || true

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

# for whatever reason yarn isnt linking esdx in docker
# force it to link here
RUN cd packages/esdx && yarn link

RUN yarn build

CMD ["true"]
