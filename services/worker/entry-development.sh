#!/bin/bash
set -e

export CLEAR_JOBS

ENV=dev ../../dishctl.sh source_env
node dist/index.js
