# The Web App

## Local development

### Install dependencies

  * `yarn install --global expo`
  * `yarn install`

### Build (and auto rebuild on file changes)

`yarn build:watch`

### Run development server

`yarn start`

### Run end to end tests

First build the docker container, this can take up to 30 minutes:

    * At the very root of the entire git repo:
      `docker build -t dish/web -f apps/web/Dockerfile .`

    * Run the production build of the web site (it exposes on port 19006):
      `docker run --rm --net host dish/web`

    * To connect to our production backing services, visit:
      'http://d1sh_hasura_live:19006'

If you want to run end to end tests:

    * Make sure the entire stack is up with (this may need to be run a few times):
      `docker-compose build && docker-compose up`

    * Run the migrations, from the `services/hasura` path:
      ```
      hasura migrate apply --endpoint http://localhost:8080 --admin-secret=password
      ```

    * To connect to these local services, visit:
      'http://localhost:19006'

    * Run the tests. from the `apps/web` path:
      `./test/testcafe.sh`

