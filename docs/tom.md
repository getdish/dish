# July

- Photos table separation
- Duplicate images being selected from home
  - Can we make those come from dishes?
- Crawling more cities
  - Crawl "Mo’orea" for nick
- Auth - work you need to do for backend for social login?
  - Apple Login is probably best, Google would be second I think
- Point dishapp.com
- Dish rating sorting order
- Sentiment introspection
  - store/show (dish + sentiment + reviewText) somewhere
- Instagram crawler
  - Images AND news/events
  - Really helpful at start for SF / homepage
- Images
  - Split photos into own table so we can limit/sort/save jsonb time
  - Dish images improvements
    - pick higher res? read metadata?
    - ML model or similar to choose quality
  - Google images?
- Dish improvements
  - matching images => dish could be upgraded a lot
  - how do we resolve menu / dish?
    - In the UI it should show them all as "one thing", but we may need to do some work backend to fix that.
- Crawlers
  - Postmates / Caviar

✔️ : Done
👷: Currently or will actively work on
⚠️ : Not prioritising

# Home

my ideal query for homepage:

```
const cuisines = query.trending_cuisines({ in: { location... } })

cuisines.map(cuisine => {
  query.trending_restaurants({ in..., dish_id? })
  query.trending_dishes({ in..., restauarant_id? })
})
```

That would let me basically mix and match and build up the query how we want, and i can build a really nice home. I'd say lower priority here than a lot of data stuff but if you want to take a stab its worth it whenever if its not too hard.

But when I search "Vietnamese" I want to then sow the trending dishes still, so it would be useful to then have this on search results page when a country is selected:

```
query.trending_dishes({ in..., parent_tag: 'Vietnamese' })
```

The autocomplete would show this same query too! Because you want the searchbar to show (Vietnamese). And then I click it show the trending dishes as autocomplete options.

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
