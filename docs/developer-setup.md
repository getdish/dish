# Local Development and Production Management

Contents:

- [Getting started](#getting-started)
- [Core Stack](#core-stack)
- [Web app](#web-app)
- [Hasura](#hasura)
- [Kubernetes](#kubernetes)

## Getting Started

### Repo encrypted credentials

All Dish's credentials are stored in `.env.enc.production.yaml`. Even third-party web
logins are contained in this file. To decrypt it:

- Install [git-crypt](https://github.com/AGWA/git-crypt).
- If you're GPG key hasn't been added to the repo then ask your nearest Dish dev to either be added to the repo or ask for the decryption key.
- If you're GPG key is in the repo and you have `git-crypt` installed, then just run
  `git-crypt unlock` and use the repo as normal.
- However, if you're using the raw decryption key it will likely be base64 encoded for ease of communication. If the key ends with a "==" this means you can run `base64 -d [long string of random character==]` to get the raw key.
- Copy the raw key to a file, eg `/tmp/master/key`
- Within the path of the repo run `git-crypt unlock /tmp/master/key`
- You can now just use `git` as normal, all the encryption/decryption happens
  automatically with hooks and filters.

## Core Stack

The core stack contains the minimum services needed to run the web app locally. This stack
can be easily run with Docker Compose: https://docs.docker.com/compose/install/

Once you have Docker Compose installed, go to the root of this repo and run:

`docker-compose up`

For initial installation you may need to run this command a few times so postgres can generate encryption keys.

When you need to rebuild the containers to update their code run:

`docker-compose build`

## The Web App

### Install dependencies

- `yarn install`

### Build (and auto rebuild on file changes)

`yarn build:watch`

### Run

- `yarn start` (for development)
- `yarn start:prod` (for production)

### Build and run (pointed at production endpoints)

- `yarn build:web`
- `yarn start:prod:bundle`

### Run end to end tests

First build the docker container, this can take up to 30 minutes:

    * At the very root of the entire git repo:
      `docker build -t dish/web -f apps/web/Dockerfile .`

    * Run the production build of the web site (it exposes on port 19006):
      `docker run --rm --net host dish/web`

    * To connect to our production backing services, visit:
      'http://d1sh_hasura_live:19006'

If you want to run end to end tests:

    * Make sure the [core stack](#core-stack) is up:
      `docker-compose build && docker-compose up`

    * Run the migrations, from the `services/hasura` path:
      ```
      hasura migrate apply --endpoint http://localhost:8080 --admin-secret=password
      ```

    * To connect to these local services, visit:
      'http://localhost:19006'

    * Run the tests. from the `apps/web` path:
      `./test/testcafe.sh`

## Hasura

### Hasura CLI

The Hasura CLI is useful for a variety of admin tasks such as creating/running
migrations and serving an admin web UI.

Install the Hasura CLI:

```
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
```

If this is your first install, or there's new migrations waiting to be run:

`hasura migrate apply --endpoint http://localhost:8080 --admin-secret=password`

To remove data / reset dev env:

`docker-compose rm -f`

Then run the admin UI using:

`hasura console --endpoint http://localhost:8080 --admin-secret=password`

This will set up two way persistence so when you modify tables it persists to
your migrations.

You might want to try the experimental migration squasher as the console tends
to verbosely create a new migration for every single unit of change.

`hasura migrate squash --from <timestamp of most recently committed migration> --endpoint http://localhost:8080 --admin-secret=password`

### Seed data

#### Importing

If you have a dump file named 'restaurants.dump' you can load it from the current working
directory with the following command:

`psql -d dish -c "TRUNCATE TABLE restaurant CASCADE" && psql -d dish -c "\copy restaurant FROM './restaurants.dump'"`

### Exporting

First make sure you have a port open to the live DB (see our Kubernetes docs for more info)

```
kubectl port-forward svc/postgres-postgresql 15432:5432 -n postgres
```

Then run the following (the password is in `.env.enc.production`):

```
PGPASSWORD=$DISH_PG_PASS psql -p15432 -h localhost -U postgres -d dish -c "\copy \
(select * from restaurant WHERE ST_DWithin(location, ST_MakePoint(-122.42,37.76), 1)) \
TO './restaurants.dump'"
```

### Misc

#### Using the live DB from your local machine

Note that the `@dish/graph` package is set up to use the live Hasura instance if the
domain name contains 'hasura_live'. This was setup because the React Native framework, Expo,
cannot easily get its config recognised by our internal packages. The domain can be achieved by setting your local machine's `/etc/hosts` file with an entry like
`127.0.0.1 d1sh_hasura_live.com`. You may want to avoid spelling 'dish' with a real 'i' as that is a keyword for triggering other production features.

## Kubernetes

Our Kubernetes (k8s) is managed by Terraform, an Infrastructure as Code framework. This means that all changes to the cluster architecture and state can be tracked in Git. Some changes such as autoscaling changes are obviously not tracked.

### Getting started

#### Prerequisites

All of these should be installable through your OS's standard package manager (Brew, Snaps, PPAs). However, most of these also have oneliner `curl` commands to install simple static binaries.

- [`doctl`](https://github.com/digitalocean/doctl): Talking to the Digital Ocean API.
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/): Talking to the Kubernetes API.
- [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html): Infrastructure As Code. Talking to the k8s API.
- [Helm](https://helm.sh/docs/intro/install/) (v2.6.1): Kubernetes package manager.

#### Authorizing `doctl`

`doctl auth init -t $DIGITAL_OCEAN_API_TOKEN`
(Token is avaiable in `enc.env.production.yaml`)

#### Creating the cluster for the first time

- `./etc/terraform_init.sh` Connects to DO Spaces to save state. Downloads modules
- `terraform apply -target=module.cluster` Just build the bare compute resources
- `doctl kubernetes cluster kubeconfig save dish` Sets up `kubectl`
- `./etc/helm_fix.sh` Applies Helm (k8s package manager) fix.
- `terraform apply` Adds all the remaining resources
- `rio up --answers env.enc.production.yaml` Bring up the main Dish services using Rio

Currently there doesn't seem to be an easy way to commit sub domain mappings, so after
Rio is up:

- `rio domain register hasura.rio.dishapp.com hasura`
- `rio domain register lab.dishapp.com lab`
- `rio domain register worker-ui.rio.dishapp.com worker-ui`

#### Connecting to an existing cluster

- `terraform init` Connects to DO Spaces to save state. Downloads modules
- `doctl kubernetes cluster kubeconfig save dish` Sets up `kubectl`

##### Load Balancer IP

A platform-specific load balancer will be created outside the Kubernetes cluster. On DO it doesn't currently seem possible to associate a specific IP address. So you will need to look at the DO UI under Networking->Load Balancers to find the new IP address and assign it as an A record to the appropriate domain. NB: Though at the time of writing I can't seem to prevent Rio from setting up its own load balancer, so you might have to figure out which load balancer is actually the main one: it's the one created by Helm's Nginx Ingress
(see `k8s/nginx-ingress.tf`).

#### Deploying

In order to synchronise shared credentials between Terraform and Rio, Terraform's deploy command must use `bin/yaml_to_env.sh` to provide the necessary ENV vars. So the deployment command, from the `k8s/` path is `eval $(../bin/yaml_to_env.sh) terraform apply`.

### What's on our cluster?

#### Rio

See: https://github.com/rancher/rio

Rio is a set of k8s resources that help building, deploying and managing web apps. It's somewhat analagous to Heroku, but much more powerful. It automatically builds apps from Docker Compose-like config files, deploys those builds in a safe 'rollout' fashion (so that new builds are only permanently exposed if they are healthy) and automatically scales apps depending on load.

It is possible to deploy cluster infrastructure like databases in Rio, but in this case we're using native k8s methods for managing non app-specific resources. In most cases this is just because Rio isn't specialised for such uses, for instance it doesn't have good support for provisioning dedicated volumes to persist DB data.

The magic Rio command for deploying everything is:
`rio up --answers env.enc.production.yaml`. But you will likely never need to run it as deployment is automated based on CI builds passing tests.

#### Current public services exposed by Rio

- https://hasura.rio.dishapp.com GraphQL service
- https://worker-ui.rio.dishapp.com View current worker jobs, retries, failures, etc
- https://lab.dishapp.com React app for experimental ideas

#### Databases

Postgres and Redis are installed using Helm charts. Admin UIs for each coming soon...

#### Nginx Ingress

This is basically our interface to the public internet. It's hooked up
to Lets Encrypt via a Helm-installed cert-manager service to automatically manage SSL certs.
We have wildcard certs and rules for `*.rio.dishapp.com` and `*.k8s.dishapp.com`. If you want
lower level subdomains (eg; `super.dishapp.com`), you wil need to add rules in the relevant
`kubernetes_ingress` Terraform resource. Nginx Ingress can also do everything that Nginx can do.

#### Prometheus

Prometheus is a monitoring framework. It collects metrics from all kinds of places, both from
the cluster itself and the various apps and services running on the cluster. The main access
to Prometheus is via its Grafana UI: https://grafana.k8s.dishapp.com The username is `admin`
and the password is in `env.enc.production.yaml`

#### Private Docker registry

This allows us to publish and pull private Docker images. Available at:
https://docker.k8s.dishapp.com Username and password available in `env.enc.production.yaml`.

#### Sentry error tracking and management

Sentry is an advanced error tracking interface: https://sentry.io/welcome/

Our service is at https://sentry.k8s.dishapp.com The username is 'admin@sentry.local'
and the password is in `env.enc.production.yaml`.

#### Kubernetes dashboard

The k8s dashboard gives a good overview of everything running on the cluster. It can be
very helpful for debugging. Though do remember `kubectl` can do everything the dashboard
does and more. The dashboard is provided by Digital Ocean:
https://cloud.digitalocean.com/kubernetes/clusters/f2db42e5-2407-4422-920d-b307bc5f636d/dashboard/ Though they don't seem to update the underlying dashboard version very often, so
we could deploy our own at somepoint with a Helm chart.
