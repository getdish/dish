#!/usr/bin/env bash
set -e pipefail

flyctl secrets set \
    POSTGRES_USER="postgres"
    POSTGRES_PASSWORD="postgres"
    POSTGRES_DB="scrape_data" || true
