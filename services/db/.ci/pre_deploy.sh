#!/bin/bash
set -e pipefail

if [ "$FLY_PG_PASSWORD" = "" ]; then
    echo "missing env"
    exit 1
fi

flyctl secrets set \
    SU_PASSWORD=$FLY_PG_PASSWORD \
    REPL_PASSWORD=$FLY_PG_REPL_PASSWORD || true

# can cause startup issues for hasura so clear here first
./dishctl.sh hasura_clean_event_logs
