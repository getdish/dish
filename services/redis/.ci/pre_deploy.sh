#!/usr/bin/env bash
set -e pipefail

flyctl secrets set \
    REDIS_PASSWORD="$REDIS_PASSWORD" \
    || true
