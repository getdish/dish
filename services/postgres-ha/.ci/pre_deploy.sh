#!/bin/bash
set -e pipefail

if [ "$FLY_PG_PASSWORD" = "" ]; then
    echo "missing info!"
    exit 1
fi

flyctl secrets set \
    SU_PASSWORD=$FLY_PG_PASSWORD \
    REPL_PASSWORD=$FLY_PG_REPL_PASSWORD
