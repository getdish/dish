## Developing

You'll need Postgres and the Postgis extension. Once you have those:

`creatdb dish`

Simplest way to run Hasura itself is with:

```
docker run --net=host \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://postgres@localhost/dish\
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=false \
  hasura/graphql-engine:v1.0.0
```

Install the Hasura CLI:

```
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
```

If this is your first install, or there's new migrations waiting to be run:

`hasura migrate apply --endpoint http://localhost:8080`

Then run admin using:

`hasura console --endpoint http://localhost:8080`

This will set up two way persistence so when you modify tables it persists to
your migrations.

You might want to try the experimental migration squasher as the console tends
to create a new migration for every single unit of change.

`hasura migrate squash --from <timestamp of most recently committed migration> --endpoint http://localhost:8080`
