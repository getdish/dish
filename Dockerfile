FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .

COPY packages packages

RUN yarn install
RUN yarn build

CMD ["true"]
