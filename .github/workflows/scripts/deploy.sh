#!/usr/bin/env bash
set -e

echo "Deploying production branch to production..."

./dishctl.sh db_migrate
./dishctl.sh ci_push_images_to_latest
./dishctl.sh rollout_all_services

HOOK=$(\
  grep 'SLACK_MONITORING_HOOK:' env.enc.production.yaml \
  | tail -n1 | cut -c 24- | tr -d '"'\
)
commit=$(git rev-parse HEAD)
link="https://github.com/getdish/dish/tree/$commit"
message="
Successful Deploy of $commit to production Kubernetes \n
Code: https://github.com/getdish/dish/tree/$commit \n
CI Run: https://github.com/getdish/dish/actions/runs/$GITHUB_RUN_ID?check_suite_focus=true
"
curl -X POST $HOOK \
  -H 'Content-type: application/json' \
  --data @- <<EOF
  {
    "text": "$message",
  }
EOF
