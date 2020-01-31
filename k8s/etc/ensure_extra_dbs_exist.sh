#!/usr/bin/env bash

kubectl exec -it postgres-postgresql-0 -n postgres -- bash -c "\
PGPASSWORD=$POSTGRES_PASSWORD psql \
  -U postgres \
  -tc \"SELECT 1 FROM pg_database WHERE datname = 'sentry'\" \
  | grep -q 1 \
|| \
PGPASSWORD=$POSTGRES_PASSWORD psql \
  -U postgres \
  -c \"CREATE DATABASE sentry\""
