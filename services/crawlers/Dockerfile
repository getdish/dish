# This stage installs our modules
FROM mhart/alpine-node:12
WORKDIR /app

# Then we copy over the modules from above onto a `slim` image
FROM mhart/alpine-node:slim-12

WORKDIR /app
COPY --from=0 /app .
COPY . .
CMD ["node", "_/index.js"]
