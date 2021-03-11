#!/bin/bash
set -e

if [ "$STORMPROXY_HOSTS" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    STORMPROXY_HOSTS="$STORMPROXY_HOSTS" \
    || true
