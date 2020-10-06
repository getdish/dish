# Local Development and Production Management

Contents:

- [Getting started](#getting-started)
- [Core Stack](#core-stack)
- [Web app](#web-app)
- [Hasura](#hasura)
- [Kubernetes](#kubernetes)

## Getting Started

### Repo encrypted credentials

All Dish's credentials are stored in `.env.enc.production.yaml`. Even third-party web logins are contained in this file. To decrypt it:

- Install [git-crypt](https://github.com/AGWA/git-crypt).
- If you're GPG key hasn't been added to the repo then ask your nearest Dish dev to either be added to the repo or ask for the decryption key.
- If you're GPG key is in the repo and you have `git-crypt` installed, then just run
  `git-crypt unlock` and use the repo as normal.
- However, if you're using the raw decryption key it will likely be base64 encoded for ease of communication. If the key ends with a "==" this means you can run `base64 -d [long string of random character==]` to get the raw key.
- Copy the raw key to a file, eg `/tmp/master/key`
- Within the path of the repo run `git-crypt unlock /tmp/master/key`
- You can now just use `git` as normal, all the encryption/decryption happens
  automatically with hooks and filters.

### Using environment in commands

You can avoid copy-pasting environment variables using this:

```
eval $(./dishctl.sh yaml_to_env) some_command_that_needs_dish_ENV
```

## Core Stack

The core stack contains the minimum services needed to run the web app locally. This stack
can be easily run with Docker Compose: https://docs.docker.com/compose/install/

Once you have Docker Compose installed, go to the root of this repo and run:

`docker-compose up`

For initial installation you may need to run this command a few times so postgres can generate encryption keys.

When you need to rebuild the containers to update their code run:

`docker-compose build`

To build an individual container:

`docker-compose build [container-name]`

So, for example `docker-compose build user-server`

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
      `docker build -t dish/app -f dish-app/Dockerfile .`

    * Run the production build of the web site (it exposes on port 80):
      `docker run -it --rm --net host dish/app`

    * To connect to our production backing services:
      * add 127.0.0.1 d1live.com to /etc/hosts
      * visit http://d1live.com

If you want to run end to end tests:

    * Make sure the [core stack](#core-stack) is up:
      `docker-compose build && docker-compose up`

    * Run the migrations, from the `services/hasura` path:
      ```
      hasura migrate apply --endpoint http://localhost:8080 --admin-secret=password
      ```

    * To connect to these local services, visit:
      'http://localhost:80'

    * Run the tests. from the `dish-app` path:
      `./test/testcafe.sh`

## Hot Deploys

If you need to deploy something quickly and are willing to skip CI, you can run a hot deploy.

You'll need a few things set up first:

    - `buildkitd`, `kubectl` and `doctl` installed
    - `doctl auth init -t $TF_VAR_DO_DISH_KEY` token is avaiable in enc.env.production.yaml
    - `doctl kubernetes cluster kubeconfig save dish`
    - Login to our Docker registry:
        `docker login docker.k8s.dishapp.com -u dish -p $password`
        Password is in `env.enc.production.yaml`

Then you can use the `./k8s/etc/hot_deploy.sh` script (see comments in the script for more detailed instructions):

```
./k8s/etc/hot_deploy.sh $service [with-base]
```

Where `$service` is the name of a service in your `Riofile`. And optionally specify 'with-base'
if you've changed anything relevant in our packages.

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
kubectl port-forward svc/postgres-ha-postgresql-ha-pgpool.postgres-ha 15432:5432 -n postgres
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
- [Helm](https://helm.sh/docs/intro/install/): Kubernetes package manager.

#### Authorizing `doctl`

`doctl auth init -t $DIGITAL_OCEAN_API_TOKEN`
(Token is avaiable in `enc.env.production.yaml`)

#### Creating the cluster for the first time

- `./etc/terraform_init.sh` Connects to DO Spaces to save state. Downloads modules
- `terraform apply -target=module.cluster` Just build the bare compute resources
- `doctl kubernetes cluster kubeconfig save dish[blue/green]` Sets up `kubectl`
- `terraform apply` Adds all the remaining resources

#### Connecting to an existing cluster

- `terraform init` Connects to DO Spaces to save state. Downloads modules
- `doctl kubernetes cluster kubeconfig save dish` Sets up `kubectl`

##### Load Balancer IP

A platform-specific load balancer will be created outside the Kubernetes cluster. On DO it doesn't currently seem possible to associate a specific IP address. So you will need to look at the DO UI under Networking->Load Balancers to find the new IP address and assign it as an A record to the appropriate domain. NB: Though at the time of writing I can't seem to prevent Rio from setting up its own load balancer, so you might have to figure out which load balancer is actually the main one: it's the one created by Helm's Nginx Ingress
(see `k8s/nginx-ingress.tf`).

#### Deploying

In order to synchronise shared credentials between Terraform and Rio, Terraform's deploy command must use `./dishctl.sh yaml_to_env` to provide the necessary ENV vars. So the deployment command, from the `k8s/` path is `eval $(./dishctl.sh yaml_to_env) terraform apply`.

#### Notes on creating a new cluster
When setting up a Blue/Green cluster, I found that:
  * `nodeSelector` isn't powerful enough to prevent the CI node getting full of other pods. But
    DO still haven't developed native support for taints/tolerations. Watch:
    https://github.com/digitalocean/DOKS/issues/3
  * `k8s/etc/hot_deploy.sh` for each service needed to be run. This could be done by doing
    a Github deploy too.
  * In Hasura's console, I needed to click the "Reload metadata" button to get Hasura consistent
    with the DB again. I have no idea why.

### What's on our cluster?

#### Databases

The main DB is Postgres (under the `postgres-ha` namespace), it is setup in High Availability
mode with replication and failover. There is also another Postgres DB that just keeps our
scrape data. And Redis is installed to keep worker jobs.

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

#### Private Docker registry and Buildkitd

This allows us to publish and pull private Docker images. Available at:
https://docker.k8s.dishapp.com Username and password available in `env.enc.production.yaml`.

Buildkit builds images remotely on our cluster. It's mostly used by CI. But you can use
with the `k8s/etc/hot_deploy.sh` script

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
