FROM node:12.16.1-buster
WORKDIR /app

COPY packages packages
COPY services services
COPY dish-app dish-app
COPY package.json .
# Remove all files that aren't `package.json`
RUN find . \! -name "package.json" -type f -print | xargs rm -rf

FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV DOCKER_BUILD=true

# The absolute minimum files needed to `yarn install`
# This makes full use of docker's caching
COPY --from=0 /app .
COPY yarn.lock .
COPY .yarnrc .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc
RUN yarn install --frozen-lockfile && yarn cache clean && yarn postinstall

COPY .prettierignore .
COPY .prettierrc .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .
COPY ava.config.js .
COPY packages packages
COPY services services
COPY dish-app dish-app

RUN yarn build

CMD ["true"]
