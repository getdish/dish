#!/usr/bin/env bash
set -e

PATH=$PATH:$HOME/bin

./.github/workflows/scripts/setup_admin.sh

echo "Deploying production branch to production..."

kubectl port-forward svc/postgres-ha-postgresql-ha-pgpool 15432:5432 -n postgres &
sleep 5
./services/hasura/etc/migrate.sh

echo "Pushing new docker images to production registry..."
DISH_REGISTRY_PASSWORD=$(\
  grep 'DOCKER_REGISTRY_PASSWORD:' env.enc.production.yaml \
  | tail -n1 | cut -c 27- | tr -d '"'\
)
docker login $DISH_REGISTRY -u dish -p $DISH_REGISTRY_PASSWORD
declare -a images=(
  "dish-app"
  "worker"
  "dish-hooks"
  "gorse"
  "jwt-server"
  "search"
  "cron"
)
for image in "${images[@]}"
do
  docker push $DISH_REGISTRY/dish/$image
done

kubectl rollout \
  restart deployment \
  $(kubectl get deployments | tail -n +2 | cut -d ' ' -f 1)

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
