#!/bin/bash

set -e

SERVICES=$(find . -name Riofile -printf '%h\n' | sort -u)

echo "deploying services: $SERVICES"

for service in "${SERVICES[@]}"
do
  (
    cd $service && rio up
  )
done
