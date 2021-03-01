FROM netresearch/dcind:latest

COPY docker-compose.yml docker-compose.yml
COPY dishctl.sh dishctl.sh

RUN ./dishctl.sh docker_pull_images_that_compose_would_rather_build

RUN eval $(./dishctl.sh yaml_to_env) DISH_IMAGE_TAG=":latest" \
  docker-compose up -d dish-app-web dish-hooks search tileserver worker
