# an experiment in running all apps in docker-compose in docker
# fly doesnt set privileged i believe so this fails

FROM netresearch/dcind:latest

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh parallel

WORKDIR /app

COPY docker-compose.yml docker-compose.yml
COPY dishctl.sh dishctl.sh
COPY env.enc.production.yaml env.enc.production.yaml

RUN git config --global user.email "teamdishapp@gmail.com"
RUN git config --global user.name "Dish"
RUN git init
RUN git add -A
RUN git commit -m 'init'

RUN /usr/local/bin/dockerd

RUN eval $(./dishctl.sh yaml_to_env) \
  ./dishctl.sh docker_pull_images_that_compose_would_rather_build

RUN eval $(./dishctl.sh yaml_to_env) DISH_IMAGE_TAG=":latest" \
  docker-compose up -d dish-app dish-hooks search tileserver worker
