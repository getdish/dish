#!/bin/bash

set -e

PROJECT_ROOT=$(git rev-parse --show-toplevel)

pushd $PROJECT_ROOT
./dishctl.sh timescale_command "CREATE DATABASE scrape_data;"
./dishctl.sh timescale_migrate
popd

