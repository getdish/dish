## Use the following image for ARM
FROM fedormelexin/graphql-engine-arm64:v2.1.0-beta.1.cli-migrations-v2

RUN apt-get update && apt-get install -y netcat

# set an env var to let the cli know that
# update notification is disabled
ENV HASURA_GRAPHQL_SHOW_UPDATE_NOTIFICATION=false

COPY docker-entrypoint.sh /bin/
# COPY cli-hasura-linux-amd64 /bin/hasura-cli

## Use the following image for ARM
COPY cli-hasura-linux-arm64 /bin/hasura-cli
RUN chmod +x /bin/hasura-cli 

# set an env var to let the cli know that
# it is running in server environment
ENV HASURA_GRAPHQL_CLI_ENVIRONMENT=server-on-docker

ENTRYPOINT ["docker-entrypoint.sh"]

# CMD ["graphql-engine", "serve"]
