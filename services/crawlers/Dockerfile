FROM mhart/alpine-node:12
WORKDIR /app
COPY --from=0 /app .
COPY . .
CMD ["node", "_/index.js"]
