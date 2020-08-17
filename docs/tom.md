- Sentiment threshold / weight based on number of sentiment reviews
- Sentiment Admin interface
- Sentiment upgrades
  - explore pre-existing productionized "aspect based" or just improved sentiment models, especially ones that will give us a "confidence" value as well as the sentiment.
- GPT-2 Summarization

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
