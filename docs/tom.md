- implement v1 point ratings + voting
- changes to auth:
  - get apple-authorize app running / do basic integration with frontend, see if you can get flow working
  - login with email or username
  - register with email + username
- fix top level lense results
  - "gems" with no other filters is empty for sf
- fix http://d1sh_hasura_live.com:19006/restaurant/serafina error on gql review when not logged in
- ... continue on ratings/points/sentiment/data/infra

## Backend

- Password protect Redis server
- Endpoint for more advanced searching
- be able to pass in Taxonomy as filters
- returns Restaurant, Dish, Taxonomy.searchable, we can just do multiple requests/grouped to start

## Indexing

- Use Dish account for AWS proxies
- Use Dish account for HereMaps/Geolocator API
- Fix all the minor Sentry exceptions
- Start crawling Berlin
- Bull memory leak? Manually delete completed jobs?
- Explore better overview UI, Bullboard isn't cutting it

## Users

- User camera image upload endpoint that ties to a review of a single dish

## Architecture

- Restaurants are currently defined as unique by name+address, we can use $SOURCE_NAME-$SOURCE_UUID instead

## CI

- Find a way to truncate the DB between indivudual tests

## Monitoring

- More Grafana alerts

## Explore

- Gorse ML recommendations
- Android app

---

# Triage

## Low Priority

- [] Crawlers - Closed restaurants. Lucca's Ravlioli closed a year ago, maybe we just need to scrape that info from yelp et al (http://d1sh_hasura_live.com:19006/restaurant/lucca-ravioli-co-california/:dish?)
