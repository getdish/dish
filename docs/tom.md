# Current

## Web frontend
 - [] Search: include; current results, in the region; restaurants, dishes and locations
 - [] SSR
 - [x] Slugs
 - [] Do search on 404 page
 - [] Permalinks to source data

# Backlog

## Backend

 - [] Password protect Redis server
 - [] Endpoint for more advanced searching

 - [] be able to pass in Taxonomy as filters
 - [] returns Restaurant, Dish, Taxonomy.searchable, we can just do multiple requests/grouped to start

## Ratings Crawler

 - [] Small admin UI to control how we weigh review sources to make ratings. A way to see ~5 examples of Top "X" dish would be helpful so you can adjust ratings weights and see which looks best. Later we can make this smarter, just first step.
 - [] Step two - in admin let us control the weighing of our internal super-user reviewers weights

## Crawlers

 - [] Getting all the delivery services is big
 - [] Postmates
 - [] GrubHub
 - [] DoorDash
 - [] Use Dish account for AWS proxies
 - [] Use Dish account for HereMaps/Geolocator API
 - [] Fix all the minor Sentry exceptions
 - [] Start crawling Berlin
 - [] Bull memory leak? Manually delete completed jobs?
 - [] Explore better overview UI, Bullboard isn't cutting it

## Taxonomy

 - [] Taxonomy.searchable should be something we can control
 - [] Taxonomy types: "lense", "filter", "cuisine", "continent" - See the harcoded values in Home.swift, we need adapt all these into Taxonomy DB and then we can replace the hardcoded parts in the swift app with real queries
 - [] Automating and finishing filling out a lot of Taxonomy stuff - Admin UI needs some work to be nicer laid out and easy to edit/add
 - [] We need a Taxonomy.fuzzyFilter (and Admin UI) so we can do some matching, ie: Taxonomy("Pho").fuzzyFilter("^pho*, ^Phở*")
 - [] Rankings within each taxonomical category (#1 in Pho [type=dish], but also #22 in Date Spot [type=lense], but also #9 in Mexican [type=cuisine])

## Users
 - [] User camera image upload endpoint that ties to a review of a single dish

## Architecture

 - [] Restaurants are currently defined as unique by name+address, we can use $SOURCE_NAME-$SOURCE_UUID instead

## CI

 - [] Find a way to truncate the DB between indivudual tests

## Monitoring

 - [] More Grafana alerts

## Explore

 - [] Gorse ML recommendations
 - [] Android app

---

Previously

- filters API
  - types: lense, cuisine, simple
    - lense: uses emojis, can be voted on or controlled by us
    - simple: combines with lense: price, open now, delivers, etc
  - { query GetFilters(type: "lense") { name, icon, type, id } }
    - icon is a String / emoji
  - cuisine ("country")
    - one type of filter we'll have is cuisines, on the home screen:
      - grouped by continent! right now i'm doing something like:
        - "North American": "🇺🇸 American", "🇲🇽 Mexican"
        - so perhaps we want something like groupID on filters, and then i can just hardcode which ids map to which continents for simplicity like so:
          - 1001 = Americas
          - 1002 = Africa
          - ...
    - i'll fetch all the filters on startup essentially
- search
  - can pass it filters
  - { query SearchRequest(filters: [{ id: "0", value: true }], geoLocation: {} { restaurants } }
- home
  - shows the top dishes based on your current filters
  - heres an example filter:
    - [Delivers: true, Cuisine: 🇺🇸, Lense: "Chef Picks"]
  - all we fetch from this is top dishes like so:
    - { query GetTopDishesFor(filters: [], geoLocation: {}) { name, id, image } }
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

