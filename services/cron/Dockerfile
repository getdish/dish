FROM alpine:3.11
WORKDIR /root
ENV HOME=/root
ENV PATH="${HOME}/bin:${PATH}"

RUN mkdir bin
RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/testing s3cmd
RUN apk add --no-cache \
      curl \
      postgresql \
      bash

ADD services/cron/crontab.txt .
ADD services/cron/entry.sh .
ADD dishctl.sh .

RUN ./dishctl.sh install_doctl
RUN ./dishctl.sh install_kubectl
RUN /usr/bin/crontab crontab.txt

CMD ["/root/entry.sh"]
