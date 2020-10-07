- some restaurants have good scores, good dishes, but no headline review, must be a bug

First week October:

- get local development working better
  - when i run locally i get a number of issues from the app not using the right token for hasura to postgres giving me this[0] error.
    - make changes so it connects to local services on local
    - have `d1sh.com` point to local services only
    - have `dl1ve.com` to point to live services
    - validate going from initial sign up to login to search, etc works on local
- run through site and document anything you see that may need improvements on backend
- onboard fiverr worker with instructions on admin
  - set up permissions and an account for them
  - add a way to set the wiki description
  - try and fix any bugs with saving/editing
  - instruct them to clean up names and icons basically
- GPT
  - get top ~100 restaurants from homepage working
  - change overview to show gpt
  - use my template on the beta website to run it
  - be cautious w/ limits/cost
- run new crawl
- help update some frontend stuff
  - your updates to disambiguate on review.type would be nice to integrate on frontend in places you see reviews used
  - moving to vote for persistence
- google crawler

- also tags neede a popularity metric, useful for the "filter by dish: ..." list (currently ordered alphabetically)

[0] error:

postgres_1     | 2020-10-04 05:23:57.957 GMT [184] HINT:  No function matches the given name and argument types. You might need to add explicit type casts.
postgres_1     | 2020-10-04 05:23:57.957 GMT [184] STATEMENT:  WITH

---

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

✔️ search speed, add pre-computation for restaurant_tag.mention_count
✔️ review_agg perms for anon users
- results page hasura query performance investigation
✔️ vote table, we still need to think about the UI, what happens when someone votes up on main and down on all contributing tags?
- rtag.sentences relation for easy access to all mentions of a rish in reviews
- self crawler has production-only bug where null tags are appearing in tag score SQL (and failing the crawl for that restaurant)

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
