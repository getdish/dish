# Developing

## Common setup

- In project root: `yarn install`, then `yarn build`.
- TODO: setup Lerna

## Crawlers
- Install Redis. Usually from your package manager or: https://redis.io/topics/quickstart
- Copy `.env.sample` to `.env`
- Build Typescript with `yarn watch` (TODO: setup Lerna)
- Run the worker daemon with `yarn run worker-watch`
- Send jobs to worker with `yarn start`

# TODO:
