#!/bin/bash

set -e

SERVICES=$(find . -name Riofile -print0 | xargs -0 -n1 dirname | sort --unique)

echo "deploying services: $SERVICES"

for service in "${SERVICES[@]}"
do
  (
    cd $service && rio up
  )
done
