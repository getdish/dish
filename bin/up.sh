#!/bin/bash

set -e

# assumes we have fd, setup in start.h
SERVICES=(`fd Riofile | sed 's,/*[^/]\+/*$,,'`)

echo "deploying services: $SERVICES"

for service in "${SERVICES[@]}"
do
  (
    cd $service && rio up
  )
done
