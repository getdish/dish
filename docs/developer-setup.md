# Local Development and Production Management

Contents:

- [Getting started](#getting-started)
- [Core Stack](#core-stack)
- [Web app](#web-app)
- [Hasura](#hasura)
- [Kubernetes](#kubernetes)
- [Staging](#staging)

## Getting Started

### Repo encrypted credentials

All Dish's credentials are stored in `.env`. Even third-party web logins are contained in this file. To decrypt it:

- Install [git-crypt](https://github.com/AGWA/git-crypt).
- If you're GPG key hasn't been added to the repo then ask your nearest Dish dev to either be added to the repo or ask for the decryption key.
- If you're GPG key is in the repo and you have `git-crypt` installed, then just run
  `git-crypt unlock` and use the repo as normal.
- However, if you're GPG isn't in the repo, you'll need to use a raw decryption key, which will likely be base64 encoded for ease of communication. If the key ends with a "==" this means you can run `base64 -d [long string of random character==]` to get the raw key.
- Copy the raw key to a file, eg `/tmp/master/key`
- Within the path of the repo run `git-crypt unlock /tmp/master/key`
- You can now just use `git` as normal, all the encryption/decryption happens
  automatically with hooks and filters.

### Yarn package manager and runner

There are various ways to install Yarn: https://yarnpkg.com/getting-started/install

We're currently using Yarn v2, which you can enable from standard `yarn` with:

`yarn set version berry`

### Using environment in commands

Generally you'll want to run almost everything via either `dsh` or `./dsh run`. It can be nice to add `./dsh` to your local `$PATH` or make an `alias`, so that you can call `dsh` from anywhere in the repo.

To switch envs set DISH_ENV.

### Running more easily

You can just hit the live endpoints (if dishapp.com is up): see the "Endpoints" section. Just run `yarn web` and then hit http://d1live.com and it should let you skip running docker locally.

## Core Stack

The core stack contains the minimum services needed to run the web app locally. This stack can be easily run with Docker Compose: https://docs.docker.com/compose/install/

When working with Dish's Docker images you'll often need to be logged into our Docker

Registry: `./dsh docker_login`.

Some helper commands to get started:

`dsh run yarn start` will run docker-compose for local development
`dsh migrate_hasura` for updating migrations

When you need to rebuild the containers to update their code run:

`dsh run docker-compose build`

To build an individual container:

`dsh run docker-compose build [container-name]`

So, for example `dsh run docker-compose build app`.

## Debugging broken docker build

You see the steps in the build?

```
Sending build context to Docker daemon  7.168kB
Step 1/6 : FROM node:10.15.1-alpine
 ---> fe6ff768f798
Step 2/6 : WORKDIR /app
 ---> Using cache
 ---> d9b21154b260
Step 3/6 : COPY package.json yarn.lock /app/
 ---> Using cache
 ---> f72815b0addf
Step 4/6 : RUN yarn install --frozen-lockfile
 ---> Using cache
 ---> 9ac88c8d0b9d
```

Just do this for any step to get shell access:

```
docker commit 9ac88c8d0b9d tempname
docker run -ti --rm tempname sh
```

## The Web App

At the root of the monorepo:

### Install dependencies

- `yarn install`

### Build (and auto rebuild on file changes)

`yarn build:watch`

### Run

- `yarn web` (for development)
- `yarn web:prod` (for production)

### Endpoints

You'll want to add:

```
dish.localhost 127.0.0.1
staging.dish.localhost 127.0.0.1
live.dish.localhost 127.0.0.1
```

Which are for local, staging, prod, respectively.

If you want to load those URL's without ports, which is recommended, you'll want to run nginx locally and proxy pass to the port the app runs on (4444):

`brew install nginx` and follow any instructions to run it at startup, then add this to your configuration folder (something like `/opt/homebrew/etc/nginx/servers/dish.conf`):

```
server {
  listen 80;
  server_name dish.localhost;

  location / {
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $proxy_x_forwarded_proto;
    proxy_set_header Host $host;
    proxy_pass http://0.0.0.0:4444;
  }
}
```

Now you should be able to just access http://d1sh.com to develop on the local site with the local db, or http://d1live.com for the local site with the production db.

### Developing

You'll generally run the web app (`yarn web`), build watcher (`yarn build:ts:watch`), and backend (`yarn start`) in three terminal panes.

We use `@dish/use-store` as our general state manager, you can access `window.stores` in frontend devtools to see all stores. It's sketchy and could use some more organizing principles, for now I usually put it near where it's initially used and that's about it. See the README.md there for more.

### Running tests

To ensure all the required environment run tests like this:

`dsh run yarn run ava test/* --verbose --serial`

Some tests, like the internal crawlers, require services not started by `yarn start`. These
services aren't started by `yarn start` because they're large and also because we don't really
develop against them, so it's fine to keep them out of CI. You can create proxied tunnels to all
them with:

`dsh hungry_services_tunnels`

## Hasura

### Hasura CLI

The Hasura CLI is useful for a variety of admin tasks such as creating/running
migrations and serving an admin web UI. We have both local and live instances of the Hasura console, NB: never change schema or metadata on the live Hasura console, these changes will not get persisted between deploys and can potentially cause out of sync issues. Instead, always make DB changes on your local Hasura console, this will create new files in the `services/hasura/migrations` path of the repo. You should commit them and so that they'll be automatically deployed by CI.

#### Installing the Hasura CLI:

```
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
```

If this is your first install, or there's new migrations waiting to be run:

`hasura migrate apply --endpoint http://localhost:8091 --admin-secret=password`

To remove data / reset dev env:

`docker-compose rm -f`

Then run the admin UI using:

`hasura console --endpoint http://localhost:8091 --admin-secret=password`

This will set up two way persistence so when you modify tables it persists to
your migrations.

After a while the migrations folder can get very full. Apart from being noisy, this also adds time to CI builds. It can be good to sometimes consolidate all the migrations into a single one. I've had success with this method: https://hasura.io/blog/resetting-hasura-migrations/

### Seed/Live data

This is a big dump, can potentially take nearly an hour to import:
`./dsh restore_latest_main_backup_to_local`

### Misc

#### Using the live DB from your local machine

Note that the `@dish/graph` package is set up to use the live Hasura instance if the
domain name contains 'live'. You can set such a domain up on your local machine using the `/etc/hosts` file with an entry like `127.0.0.1 d1sh_hasura_live.com`. You may want to avoid spelling 'dish' with a real 'i' as that might be a keyword for triggering other production features.

## Staging

Our staging VM is completely independent of our Kubernetes cluster. The staging VM runs on a single Digital Ocean droplet. It simply runs the same `docker-compose` setup used by local devs. The SSH private key is stored encrypted in our repo so you should be able to SSH in with:

`./dsh staging_ssh`

Deployment should happen automatically for all succesful builds on the staging branch. However, if you want changes to `docker-compose.yaml` to take affect you'll need to SSH in and manually deal with it.
