# Current
## Web frontend
[] Search: include; current results, in the region; restaurants, dishes and locations
[] SSR
[] Slugs
[] Permalinks to source data

# Backlog
## Backend
[] Password protect Redis server

## Crawlers
[] Use Dish account for AWS proxies
[] Use Dish account for HereMaps/Geolocator API
[] Fix all the minor Sentry exceptions
[] Start crawling Berlin
[] Bull memory leak? Manually delete completed jobs?
[] Explore better overview UI, Bullboard isn't cutting it

## Architecture
[] Restaurants are currently defined as unique by name+address, we can use $SOURCE_NAME-$SOURCE_UUID instead

## CI
[] Find a way to truncate the DB between indivudual tests

## Monitoring
[] More Grafana alerts

## Explore
[] Gorse ML recommendations
[] Android app
