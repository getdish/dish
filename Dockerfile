FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV DISH_LINK_RN_MODULES=false

COPY package.json .
COPY .yarnrc .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .

COPY packages packages
COPY patches patches
COPY bin bin

RUN yarn install
RUN yarn build

CMD ["true"]
