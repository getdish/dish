#!/usr/bin/env bash
set -e pipefail

flyctl secrets set \
    VIRTUAL_HOST=image-quality.dishapp.com || true
