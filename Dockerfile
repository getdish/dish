FROM node:12.16.1-buster
WORKDIR /app
ENV PATH=$PATH:/app/node_modules/.bin:node_modules/.bin
ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV DOCKER_BUILD=true

COPY package.json .
COPY .yarnrc .
COPY yarn.lock .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY tsconfig.base.json .
COPY bin bin
COPY packages packages

# TODO:
# If there is an unavoidable dependency on react* packages in the base image
# then we have a choice here, to either save time or save space.
#   * Saving space is relevant because the other service images have no need
#     for most of the deps in dish-app.
#   * But saving time is relevant because if we remove the deps here then we'd
#     only need to go and reinstall them again in the web image.
COPY dish-app dish-app
RUN cd dish-app && yarn install

RUN yarn install
RUN yarn build

CMD ["true"]
