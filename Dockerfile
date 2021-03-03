# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:15.10.0-buster as copy-stage
WORKDIR /app

# ENV YARN_VERSION 2.4.0

# for caching
RUN mkdir -p /data/.cache/yarn && \
  yarn config set cache-folder /data/.cache/yarn

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

# # remove most files (only keep stuff for install)
# RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

COPY yarn.lock .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc
COPY .prettierignore .
COPY .prettierrc .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.parent.json .
COPY tsconfig.base.json .
COPY ava.config.js .

# install
RUN yarn install --frozen-lockfile --ignore-optional \
  && yarn build \
  && yarn install --production --ignore-optional \
  && yarn cache clean

# for whatever reason yarn isnt linking esdx in docker
# force it to link here
RUN cd packages/esdx && yarn link

RUN yarn build

CMD ["true"]
