FROM node:15.10.0-buster

RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update > /dev/null && apt-get install -y s3cmd > /dev/null && apt-get clean

FROM gcr.io/dish-258800/base
COPY --from=0 /bin /usr/local/bin
WORKDIR /app/services/hooks

CMD ["node", "dist/index.js"]
