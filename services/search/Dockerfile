# build stage
FROM golang:alpine AS build-env
RUN apk --no-cache add build-base git bzr mercurial gcc
ADD services/search /src
RUN cd /src && go build -o search-server

# final stage
FROM alpine
WORKDIR /app
COPY --from=build-env /src/search-server /app/
ENTRYPOINT ./search-server
