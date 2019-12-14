#!/bin/bash

set -e

# assumes we have fd, setup in start.h
SERVICES=(`fd Riofile | sed 's,/*[^/]\+/*$,,'`)
ROOT=`pwd`

echo "deploying services: $SERVICES"

for service in "${SERVICES[@]}"
do
  cd $service
  if [ -f build.sh ]; then
    echo "building..."
    ./build.sh
  fi
  rio up
  cd $ROOT
done
