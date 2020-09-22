✔️ implement v1 point ratings + voting
- changes to auth:
  - login with email or username
  - register with email + username
- profiles loading really slow http://d1sh_hasura_live.com:19006/u/admin
- fix top level lense results
  ✔️  "gems" with no other filters is empty for sf
✔️  fix http://d1sh_hasura_live.com:19006/restaurant/serafina error on gql review when not logged in
- searching without tag is slow - try "birria taco" in sf
  - this is because of the full-text search across reviews and menu_items tables. there's a
    a bit of research i could to improve the index. but maybe we need to look at a dedicated
    full-text engine. but remember that searching for tags is still as fast as ever
- ... continue on ratings/points/sentiment/data/infra

## Indexing

- Use Dish account for AWS proxies
- Use Dish account for HereMaps/Geolocator API
- Fix all the minor Sentry exceptions

## Users

- User camera image upload endpoint that ties to a review of a single dish

## Monitoring

- More Grafana alerts

## Explore
-

---

# Triage
-
## Low Priority

- [] Crawlers - Closed restaurants. Lucca's Ravlioli closed a year ago, maybe we just need to scrape that info from yelp et al (http://d1sh_hasura_live.com:19006/restaurant/lucca-ravioli-co-california/:dish?)
