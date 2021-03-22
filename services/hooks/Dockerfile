FROM registry.fly.io/dish-base:latest

WORKDIR /app

RUN rm -r dish-app \
      && rm -r snackui
      # && rm -r services

# FROM registry.fly.io/dish-base:latest

# COPY --from=0 services/hooks services/hooks

# s3cmd has some libraries it loads, idk where from, not debugging it for now
# woudl speed up builds marginally
# FROM registry.fly.io/dish-base:latest
# COPY --from=0 /bin /usr/local/bin
# COPY --from=0 /usr/bin /usr/bin
# COPY --from=0 /usr/local /usr/local
# ENV PATH=$PATH:/usr/bin

WORKDIR /app/services/hooks

CMD ["node", "dist/index.js"]
