## Developing

### Quickstart

If you don't want or have Postgres, Postgis and Hasura on your machine, the
simplest way to install and run them is with `docker-compose up` in this folder.
Here are the Docker Compose installation instructions:
https://docs.docker.com/compose/install/

> Note: had to run docker-compose a few times so postgres could generate encryption keys

You can now skip the next 2 sections.

### Postgres and Postgis

If you already have Postgres and Postgis on your machine your next step is only
to create the database for Dish: `creatdb dish`

### Hasura

The simplest way to run Hasura itself is with:

```
docker run --net=host \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres@localhost/dish\
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=false \
  hasura/graphql-engine:v1.1.0
```

See `docker-compose.yml` for extra ENV variables needed for working with things like
auth and JWT tokens.

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

## Seed data

### Importing

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

## Misc

### Using the live DB from your local machine

Note that the `@dish/models` package is set up to use the live Hasura instance if the
domain name contains 'hasura_live'. This was setup because the React Native framework, Expo,
cannot easily get its config recognised by our internal packages. The domain can be achieved by setting your local machine's `/etc/hosts` file with an entry like
`127.0.0.1 d1sh_hasura_live.com`. You may want to avoid spelling 'dish' with a real 'i' as that is a keyword for triggering other production features.
