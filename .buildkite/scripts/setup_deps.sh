#!/bin/bash

set -eo pipefail

if ($(which netstat > /dev/null)); then
  echo $(date -u) "netstat installed"
else
  apt-get update && apt-get install -y net-tools
  echo $(date -u) "netstat installed"
fi

if ($(which psql > /dev/null)); then
  echo $(date -u) "psql installed"
else
  apt-get update && apt-get install -y postgresql-client
  echo $(date -u) "postgres installed"
fi

if ($(which docker > /dev/null)); then
  echo $(date -u) "node/docker/npm installed"
else
  apt-get update
  apt-get install -y docker docker-compose nodejs npm
  curl -o- -L https://yarnpkg.com/install.sh | bash
  echo $(date -u) "docker/npm installed"
fi

export PATH=$PATH:$HOME/bin
if ($(which gcloud > /dev/null)); then
  echo $(date -u) "gcloud installed"
  ./dishctl.sh gcloud_init
  wait
  echo $(date -u) "gcloud init"
else
  apt-get install -y libssl-dev libffi-dev
  ./dishctl.sh install_gcloud_sdk
  echo $GCLOUD_PATH
fi
