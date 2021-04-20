#!/usr/bin/env bash
set -e pipefail

echo "Deploying..."

export DISH_ENV=production
PROJECT_ROOT=$(git rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

# deploy fly
./dishctl.sh deploy_all
