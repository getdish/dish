# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:15.10.0-buster as copy-stage
WORKDIR /app

# ENV YARN_VERSION 2.4.0
# # for caching
# RUN mkdir -p /data/.cache/yarn && \
#   yarn config set cache-folder /data/.cache/yarn

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

FROM node:15.10.0-buster
COPY --from=copy-stage /app /app
WORKDIR /app

COPY .yarnrc .
COPY yarn.lock .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc

RUN  yarn install --frozen-lockfile --ignore-optional

COPY .prettierignore .
COPY .prettierrc .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.parent.json .
COPY tsconfig.base.json .
COPY ava.config.js .

# autoreconf for node-jq
RUN (cd packages/esdx && yarn link) \
  && yarn build \
  && rm -r node_modules \
  && yarn install --production --ignore-optional --offline \
  && yarn cache clean

CMD ["true"]
