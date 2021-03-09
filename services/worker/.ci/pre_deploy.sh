#!/usr/bin/env bash
set -e pipefail

if [ "$GOOGLE_SEARCH_PROXY" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    DISH_ENV="staging" \
    HASURA_ENDPOINT="http://hasura:8080" \
    REDIS_HOST="dish-redis.internal" \
    REDIS_PORT="${FLY_REDIS_PORT}" \
    REDIS_PASSWORD="${FLY_REDIS_PASSWORD}" \
    PGHOST="postgres" \
    PGPASSWORD="postgres" \
    HASURA_SECRET="${HASURA_GRAPHQL_ADMIN_SECRET:-password}" \
    TIMESCALE_HOST="$TIMESCALE_FLY_POSTGRES_HOST" \
    TIMESCALE_USER="$TIMESCALE_FLY_POSTGRES_USER" \
    TIMESCALE_PASSWORD="$TIMESCALE_FLY_POSTGRES_PASS" \
    TIMESCALE_PORT="$TIMESCALE_FLY_POSTGRES_PORT" \
    TIMESCALE_DB="$TIMESCALE_FLY_POSTGRES_DB" \
    UBEREATS_PROXY="${UBEREATS_PROXY}" \
    HEREMAPS_API_TOKEN="${HEREMAPS_API_TOKEN}" \
    INFATUATED_PROXY="${INFATUATED_PROXY}" \
    MICHELIN_PROXY="${MICHELIN_PROXY}" \
    YELP_AWS_PROXY="${YELP_AWS_PROXY}" \
    TRIPADVISOR_PROXY="${TRIPADVISOR_PROXY}" \
    GOOGLE_SEARCH_PROXY="${GOOGLE_SEARCH_PROXY}" \
    GOOGLE_AWS_PROXY="${GOOGLE_AWS_PROXY}" \
    GOOGLE_USERCONTENT_AWS_PROXY="${GOOGLE_USERCONTENT_AWS_PROXY}" \
    DOORDASH_GRAPHQL_AWS_PROXY="${DOORDASH_GRAPHQL_AWS_PROXY}" \
    GRUBHUB_AWS_PROXY="${GRUBHUB_AWS_PROXY}" \
    YELP_CDN_AWS_PROXY="${YELP_CDN_AWS_PROXY}" \
    LUMINATI_PROXY_HOST="${LUMINATI_PROXY_HOST}" \
    LUMINATI_PROXY_PORT="${LUMINATI_PROXY_PORT}" \
    LUMINATI_PROXY_DATACENTRE_USER="${LUMINATI_PROXY_DATACENTRE_USER}" \
    LUMINATI_PROXY_DATACENTRE_PASSWORD="${LUMINATI_PROXY_DATACENTRE_PASSWORD}" \
    LUMINATI_PROXY_RESIDENTIAL_USER="${LUMINATI_PROXY_RESIDENTIAL_USER}" \
    LUMINATI_PROXY_RESIDENTIAL_PASSWORD="${LUMINATI_PROXY_RESIDENTIAL_PASSWORD}" \
    DO_SPACES_ID="${DO_SPACES_ID}" \
    DO_SPACES_SECRET="${DO_SPACES_SECRET}" \
    GPT3_KEY="${GPT3_KEY}" \
    NODE_OPTIONS="--max_old_space_size=5120" \
    GORSE_ENDPOINT="http://dish-gorse.internal" \
    DISH_DEBUG="1" \
    || true
