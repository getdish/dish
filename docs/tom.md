# Current

## Web frontend

- [ ] Home/Data - Get home page generally working with dishes showing for most cuisines
- [ ] Indexing: a lot of duplicate restaurants
- [ ] Indexing: see why infatuated is not indexing
- [ ] Home/Search - make the filters/lenses work with taxonomy queries, you should be able to do this in the frontend and re-run actions.home.runSearch
- [ ] Do search on 404 page
- [ ] Permalinks to source data
- [ ] (low priority) Autocomplete: a quick endpoint for searching dishes + restaurants

# Backlog

## Backend

- [ ] Password protect Redis server
- [ ] Endpoint for more advanced searching
- [ ] be able to pass in Taxonomy as filters
- [ ] returns Restaurant, Dish, Taxonomy.searchable, we can just do multiple requests/grouped to start

## Indexing

- [ ] Getting all the delivery services is big (i'm happy to help a bit here too)
- [ ] Postmates
- [ ] GrubHub
- [ ] DoorDash
- [ ] Use Dish account for AWS proxies
- [ ] Use Dish account for HereMaps/Geolocator API
- [ ] Fix all the minor Sentry exceptions
- [ ] Start crawling Berlin
- [ ] Bull memory leak? Manually delete completed jobs?
- [ ] Explore better overview UI, Bullboard isn't cutting it

## Taxonomy

- [ ] Taxonomy.searchable should be something we can control
- [ ] Taxonomy types: "lense", "filter", "cuisine", "continent" - See the harcoded values in Home.swift, we need adapt all these into Taxonomy DB and then we can replace the hardcoded parts in the swift app with real queries
- [ ] Automating and finishing filling out a lot of Taxonomy stuff - Admin UI needs some work to be nicer laid out and easy to edit/add

## Users

- [ ] User camera image upload endpoint that ties to a review of a single dish

## Architecture

- [ ] Restaurants are currently defined as unique by name+address, we can use $SOURCE_NAME-$SOURCE_UUID instead

## CI

- [ ] Find a way to truncate the DB between indivudual tests

## Monitoring

- [ ] More Grafana alerts

## Explore

- [ ] Gorse ML recommendations
- [ ] Android app

---

# Triage

## Low Priority

- [] Crawlers - Closed restaurants. Lucca's Ravlioli closed a year ago, maybe we just need to scrape that info from yelp et al (http://d1sh_hasura_live.com:19006/restaurant/lucca-ravioli-co-california/:dish?)

---

Previously

- home
  - shows the top dishes based on your current filters
  - heres an example filter:
    - [Delivers: true, Cuisine: 🇺🇸, Lense: "Chef Picks"]
  - all we fetch from this is top dishes like so:
    - { query loadHomeDishesFor(filters: [], geoLocation: {}) { name, id, image } }
- restaurant info
  - geolocation, address, phone
  - dishes
  - rating
- ratings
  - star or no star
  - should be returned in all areas for both dish + restaurant
  - restaurant is just generated as an aggregate of dish + yelp and other crawled info we use
  - mutation for rating dish
- lenses
  - this is for the community / admin
  - { mutation VoteRestaurantLense(userId: "", filterId: "", value: true) }

# admin

- spreadsheet view into data
  - dishes/restaurants
  - search
  - voting
- taxonomy view for managing categorization
- city view for seeing the top unique best places per-city for the explore page
