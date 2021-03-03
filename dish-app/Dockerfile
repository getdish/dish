ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION
COPY --from=0 /app/tsconfig.base.json /app/tsconfig.base.json
COPY --from=0 /app/tsconfig.base.parent.json /app/tsconfig.base.parent.json
COPY --from=0 /app/tsconfig.json /app/tsconfig.json
COPY --from=0 /app/node_modules /app/node_modules
COPY --from=0 /app/package.json /app/package.json
COPY --from=0 /app/snackui /app/snackui

WORKDIR /app/dish-app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y parallel build-essential \
      libcairo2-dev libpixman-1-dev libpango1.0-dev \
      libjpeg62-turbo-dev libgif-dev patch

RUN yarn web:build

FROM node:15.10.0-buster-slim as slim
WORKDIR /app
COPY --from=base /app /app
WORKDIR /app/dish-app

EXPOSE 4444

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
