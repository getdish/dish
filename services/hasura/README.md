Note:

Install hasura CLI:

```
curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | bash
```

Then run admin using:

```
hasura console
```

This will set up two way persistence so when you modify tables it persists to
your migrations.
