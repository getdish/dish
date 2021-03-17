FROM node:15.10.0-buster

RUN \
  apt-get update >/dev/null && apt-get install -y parallel build-essential \
            libcairo2-dev libpixman-1-dev libpango1.0-dev \
            libjpeg62-turbo-dev libgif-dev patch > /dev/null \
      && apt-get clean \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json .babelrc post_build.sh build.config.js ./

RUN npm install

COPY src src
COPY public public

RUN npm run build

EXPOSE 3999

CMD ["npm", "run", "serve"]
