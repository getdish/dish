#!/bin/bash
set -e

docker tag \
  "gcr.io/dish-258800/$BUILDKITE_STEP_KEY/$BUILDKITE_PIPELINE_NAME-$BUILDKITE_STEP_KEY-build-$BUILDKITE_BUILD_ID" \
  "gcr.io/dish-258800/$BUILDKITE_STEP_KEY:latest"
