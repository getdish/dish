# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:12.16.1-buster
WORKDIR /app

ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV DOCKER_BUILD=true

# copy everything
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui
COPY package.json .

# remove most files (only keep stuff for install)
RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

FROM node:12.16.1-buster
WORKDIR /app
COPY --from=0 /app .

COPY yarn.lock .
COPY .yarnrc .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc

# install
RUN yarn install --frozen-lockfile && yarn postinstall && yarn cache clean

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

RUN yarn build

CMD ["true"]
