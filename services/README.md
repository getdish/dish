# Developing

## Common setup

- To automatically build and watch all code/packages: `yarn watch`.

## Worker

The worker is a daemon/client abstraction that allows placing arbitrary code on a
queue to be run by a separate dedicated process. These 'jobs' will be managed, logged,
retried and throttled.

The worker daemon requires Redis, usually available from your package manager or: https://redis.io/topics/quickstart

Run the worker daemon with `yarn run worker:watch`

## Crawlers

Crawler code can be developed without needing to run the worker daemon. The daemon simply
runs the crawler's `run()` method, so you can do this yourself manually too.

## Hasura

Hasura is our main interface to the Dish database. It is a GraphQL layer. See the README
in its folder for setup and development information.
