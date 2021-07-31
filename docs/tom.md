- todo: merge with next.md

- crawlers get working on bay area:
  - test on a handful of restaurants and ensure they are reliable/accurate
  - fix any issues due to changing api's, etc
  - we need closed restaurant detection of some sort
    - if no yelp data, y = getYelpRestaurant, p = loadPage(y.yelpUrl), p.contains('IS CLOSED')) && y.markClosed()
  - discuss any potential improvements with team
    - photos + tag detection on photos + tag sentiment
    - rating sub-factors: showing ambience/vibe/service/deal split out
  - re-run crawl bay area
    - start with partial crawl and fix any issues at scale

- homepage
  - we have a new hasura fn `list_populated`, ensure this is decent/fast
    - may want to discuss this query quickly with team and make sure good

- performance
  - some queries are somewhat slow, lets investigate search especially

- infra
  - get backups back working
  - look at ensuring we can "survive initial beta" with what we have
  - goal for first month is not to get lost in here, focus on product

- beta features
  - email setup for generally keeping up to date with users

- speeding up/simplifying dev
  - being able to run the stack with no docker would be a big boost for apple, i think its possible now but we should smooth it out
  - i'm generally pro reducing our services
    - cron/migrate/worker/run-tests seem closely related could become one thing
    - search could fold into just app (more monolithic)
    - crawlers is more of a package than a service
  - ci/release improvements
    - having the [name]/dev branches release to a pr-based staging ENV *before* running tests would be a huge win for quickly testing
    - any obvious speed wins in CI really help

- search
  - search is most likely area that will need improvement
  - we should test somehow using the app "for real", as in search the area i'm in see if it sorts right, shows places somewhat quickly, etc
  - especially tags could use love i assume
  - just getting a good idea of how we'd like to upgrade it over time
