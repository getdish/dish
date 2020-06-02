# build stage
FROM golang:1.14.4-alpine3.11 AS build-env
RUN apk --no-cache add build-base git bzr mercurial gcc
ADD services/search /src
RUN cd /src && go generate && go build -o search-server

# final stage
FROM alpine
WORKDIR /app
COPY --from=build-env /src/search-server /app/
ENTRYPOINT ./search-server
