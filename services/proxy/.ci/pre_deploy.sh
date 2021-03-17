#!/bin/bash
set -e

if [ "$YELP_AWS_PROXY" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    UBEREATS_PROXY="$UBEREATS_PROXY" \
    YELP_AWS_PROXY="$YELP_AWS_PROXY" \
    INFATUATED_PROXY="$INFATUATED_PROXY" \
    MICHELIN_PROXY="$MICHELIN_PROXY" \
    TRIPADVISOR_PROXY="$TRIPADVISOR_PROXY" \
    GOOGLE_AWS_PROXY="$GOOGLE_AWS_PROXY" \
    GOOGLE_SEARCH_PROXY="$GOOGLE_SEARCH_PROXY" \
    GOOGLE_USERCONTENT_AWS_PROXY="$GOOGLE_USERCONTENT_AWS_PROXY" \
    DOORDASH_GRAPHQL_AWS_PROXY="$DOORDASH_GRAPHQL_AWS_PROXY" \
    GRUBHUB_AWS_PROXY="$GRUBHUB_AWS_PROXY" \
    YELP_CDN_AWS_PROXY="$YELP_CDN_AWS_PROXY" \
    STORMPROXY_HOSTS="$STORMPROXY_HOSTS" \
    LUMINATI_PROXY_HOST="$LUMINATI_PROXY_HOST" \
    LUMINATI_PROXY_PORT="$LUMINATI_PROXY_PORT" \
    LUMINATI_PROXY_RESIDENTIAL_USER="$LUMINATI_PROXY_RESIDENTIAL_USER" \
    LUMINATI_PROXY_RESIDENTIAL_PASSWORD="$LUMINATI_PROXY_RESIDENTIAL_PASSWORD" \
    || true
