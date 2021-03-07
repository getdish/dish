FROM golang:1.16.0-alpine AS build-env
RUN apk --no-cache add build-base git bzr mercurial gcc

ADD . /src

RUN cd /src && go generate && go build -o search-server

# final stage
FROM alpine
WORKDIR /app
COPY --from=build-env /src/search-server /app/
ENTRYPOINT ./search-server
