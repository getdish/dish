# STEP 1
# everything that goes into deterministic yarn goes on this step

FROM node:12.16.1-buster AS build
WORKDIR /app

# first copy everything
COPY packages packages
COPY services services
COPY dish-app dish-app
COPY snackui snackui

# then, remove most files (only keep stuff for install)
RUN find . \! -name "package.json" -not -path "*/bin/*" -type f -print | xargs rm -rf

# then, add back in specific things for install
COPY package.json .
COPY yarn.lock .
COPY .yarnrc .
COPY patches patches
COPY bin bin
COPY dish-app/patches dish-app/patches
COPY dish-app/etc dish-app/etc

# now, install
RUN yarn install --frozen-lockfile && yarn cache clean && yarn postinstall

# STEP 2
# allows us to keep the big yarn install nicely cached

FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=8192"
ENV DOCKER_BUILD=true
COPY --from=build /app .

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
