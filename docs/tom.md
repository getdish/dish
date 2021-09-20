- gpt3 summaries (elethuer)
  - table style
  - restaurant + tags + source_breakdown

- profile page queries incredibly slow

- speed of search / discuss putting search.sql into the graph

- todo: merge with next.md

- HASURA_GRAPHQL_JWT_SECRET seems like its just 12346... ? should secure that

- auto generate a few lists per region, basically re-create the top/unique tags for each region and then generate lists for them (under DishBot or similar fake user)

- homepage
  - ensure the tags we have in the initial search autocomplete dropdown exist in db for next crawl (can just replace with tags that exist to save time step 1)

- infra
  - get backups back working
  - look at ensuring we can "survive initial beta" with what we have
  - goal for first month is not to get lost in here, focus on product

- beta features
  - email only login option
  - email setup for generally keeping up to date with users

- speeding up/simplifying dev
  - cron/migrate/worker/run-tests seem closely related could become one thing
  - search could fold into just app (more monolithic)
  - crawlers is more of a package than a service
  - ci/release improvements
    - having the [name]/dev branches release to a pr-based staging ENV *before* running tests would be a huge win for quickly testing
    - any obvious speed wins in CI really help
