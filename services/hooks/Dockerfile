FROM registry.fly.io/dish-base:latest
RUN rm -r dish-app

RUN echo "deb http://deb.debian.org/debian buster-backports main" >> /etc/apt/sources.list && \
      apt-get update > /dev/null && apt-get install -y s3cmd > /dev/null && apt-get clean

# s3cmd has some libraries it loads, idk where from, not debugging it for now
# woudl speed up builds marginally
# FROM registry.fly.io/dish-base:latest
# COPY --from=0 /bin /usr/local/bin
# COPY --from=0 /usr/bin /usr/bin
# COPY --from=0 /usr/local /usr/local

ENV PATH=$PATH:/usr/bin

WORKDIR /app/services/hooks

CMD ["node", "dist/index.js"]
