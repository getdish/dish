#!/bin/bash
set -e pipefail

flyctl secrets set \
    SU_PASSWORD=$FLY_PG_PASSWORD \
    REPL_PASSWORD=$FLY_PG_REPL_PASSWORD
