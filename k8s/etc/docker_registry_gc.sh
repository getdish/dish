#!/usr/bin/env bash

PATH=$PATH:$HOME/bin
echo "Checking Docker Registry free disk space..."

MINIMUM_FREE_SPACE=5000000
docker_registry_container=$(\
  kubectl get pods \
    -n docker \
  | grep Running | grep docker-registry \
  | awk '{print $1}'
)

free_space=$(
  kubectl exec \
    $docker_registry_container \
    -n docker \
    -- sh -c $'df /var/lib/registry | awk \'{print $3}\' | tail -n1'
)

if (( $free_space < $MINIMUM_FREE_SPACE )); then
  echo "Running Docker Registry garbage collection..."
  kubectl exec \
    $docker_registry_container \
    -c docker-registry \
    -n docker \
    -- sh -c \
      '/bin/registry garbage-collect \
      --delete-untagged=true /etc/docker/registry/config.yml'
else
  echo "Docker Registry has $free_space free disk space remaining"
fi

