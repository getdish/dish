#!/usr/bin/env bash
set -e

yarn ultra -r --no-pretty build
pushd services/crawlers
yarn test:scheduled
test_status=$?
popd

if [ $test_status -ne 0 ]; then
  HOOK=$(\
    grep 'SLACK_MONITORING_HOOK:' env.enc.production.yaml \
    | tail -n1 | cut -c 24- | tr -d '"'\
  )
    message="
    A test that regularly monitors our crawler code against live sources is failing.
    See: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
    "
    curl -X POST $HOOK \
      -H 'Content-type: application/json' \
      --data @- <<EOF
  {
    "text": "$message",
  }
EOF
fi
