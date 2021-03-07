FROM golang:alpine

RUN apk --no-cache add git
RUN go get -tags='avx2' github.com/zhenghaoz/gorse/...
RUN mkdir /app

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/go/bin/gorse serve --config /app/config.toml"]
