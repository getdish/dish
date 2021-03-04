#!/usr/bin/env bash
set -e pipefail

flyctl secrets set \
    VIRTUAL_HOST=bert.dishapp.com || true
