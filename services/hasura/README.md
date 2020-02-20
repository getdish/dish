## Developing

### Quickstart
If you don't want or have Postgres, Postgis and Hasura on your machine, the
simplest way to install and run them is with `docker-compose up` in this folder.
Here are the Docker Compose installation instructions:
https://docs.docker.com/compose/install/

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
  hasura/graphql-engine:v1.0.0
```

### Hasura CLI

The Hasura CLI is useful for a variety of admin tasks such as creating/running
migrations and serving an admin web UI.

Install the Hasura CLI:

```
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
```

If this is your first install, or there's new migrations waiting to be run:

`hasura migrate apply --endpoint http://localhost:8080`

Then run the admin UI using:

`hasura console --endpoint http://localhost:8080`

This will set up two way persistence so when you modify tables it persists to
your migrations.

You might want to try the experimental migration squasher as the console tends
to create a new migration for every single unit of change.

`hasura migrate squash --from <timestamp of most recently committed migration> --endpoint http://localhost:8080`
