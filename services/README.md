# Developing

## Common setup
- To automatically build and watch all code/packages: `yarn workspaces run watch`.

## Worker
The worker is a daemon/client abstraction that allows placing arbitrary code on a
queue to be run by a separate dedicated process. These 'jobs' will be managed, logged,
retried and throttled.

The daemon requires Redis, usually available from your package manager or: https://redis.io/topics/quickstart

Run the worker daemon with `yarn run worker:watch`

## Crawlers

- Copy `.env.sample` to `.env`
- Send jobs to worker with `yarn start`

# TODO:
