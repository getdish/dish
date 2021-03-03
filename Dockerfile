# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:15.10.0-buster as base
WORKDIR /app

# copy everything
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui
COPY package.json .

RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

FROM node:15.10.0-buster as install
COPY --from=base /app /app
WORKDIR /app

COPY .yarnrc.yml .
COPY yarn.lock .
COPY .yarn .yarn
COPY patches patches
COPY bin bin
COPY dish-app/etc dish-app/etc

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV DOCKER_BUILD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# install
RUN yarn install --immutable-cache \
  && yarn cache clean && ls -la .yarn

COPY .prettierrc .prettierignore tsconfig.json tsconfig.build.json \
  tsconfig.base.parent.json tsconfig.base.json ava.config.js ./
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui

RUN find . -type d \(  -name "test" -o -name "tests"  \) -print | xargs rm -rf && \
    find . -type f \(  -name "*.md" -o -name "*.jpg"  \) -print | xargs rm -rf

RUN yarn build

COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui

CMD ["true"]
