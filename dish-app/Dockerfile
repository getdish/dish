ARG DISH_BASE_VERSION=latest
FROM gcr.io/dish-258800/base:$DISH_BASE_VERSION as base

WORKDIR /app

# try and avoid reinstalls
RUN rm -r services && \
      find . -type d \(  -name "test" -o -name "tests"  \) -print | xargs rm -rf && \
      find . -type f \(  -name "*.md"  \) -print | xargs rm -rf \
      rm package.json && \
      rm yarn.lock

RUN \
  apt-get update && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

FROM base
COPY --from=base /app /app
WORKDIR /app/dish-app

COPY yarn.lock package.json ./

WORKDIR /app/dish-app
ENV NODE_ENV=production
RUN yarn web:build

EXPOSE 4444

CMD ["yarn", "web:serve", "--host", "0.0.0.0"]
