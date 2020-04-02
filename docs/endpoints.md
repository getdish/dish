# Hasura Endpoints

A collection of working `curl` requests demonstrating the various features of our API.

All GraphQL queries can be interactively generated and explored with the
Hasura Admin Console: https://hasura.rio.dishapp.com/console/api-explorer Here you will
also find the latest available field names that can be returned for each query.

These queries are for reference and need not be strictly followed, it is possible
to combine many of the features of different queries into a single query.

Pipe results into `| jq` (https://stedolan.github.io/jq/download) to get the API
responses pretty printed in your terminal.

For queries that use distance in degrees, a good rule of thumb is that 0.01 degrees is
about 1.1132km.

## Getting all restaurants within a bounding box

```
curl -H "Content-Type: application/json" \
  --data '{ "query": "query { \n
    restaurant ( \n
      where: { \n
        location: { _st_within: {
          type: \"Polygon\", \n
          coordinates: \n
            [[ \n
              [-122.47, 37.81], \n
              [-122.37, 37.81], \n
              [-122.37, 37.70], \n
              [-122.47, 37.70], \n
              [-122.47, 37.81], \n
            ]] \n
          }, \n
        }, \n
      } \n
    ) { id } \n
  }"}' \
  https://hasura.rio.dishapp.com/v1/graphql
```

## Autocomplete (restricted by radius)

`distance` is in degrees.

Eg; user has typed 'tart', note how the `%`s represent wildcards for any amount of text:

```
curl -H "Content-Type: application/json" \
  --data '{ "query": "query { \n
    restaurant ( \n
      where: { \n
        name: { _ilike: \"%tart%\" }, \n
        location: { _st_d_within: { \n
          distance: 0.05, \n
          from: { \n
            type: \"Point\", \n
            coordinates: [-122.421351,37.759251] \n
          } \n
        }} \n
      } \n
    ) { \n
      id name location \n
    } \n
  }"}' \
  https://hasura.rio.dishapp.com/v1/graphql
```

## Getting a single restaurant with dishes

```
curl -H "Content-Type: application/json" \
  --data '{ "query": "query { \n
    restaurant ( \n
      where: { \n
        id: { _eq: \"9e6489a2-6999-45ea-97c2-84738fa71b2f\" }, \n
      } \n
    ) { \n
      name address categories city created_at description \n
      dishes { \n
        name \n
        price \n
      } \n
    } \n
  }"}' \
  https://hasura.rio.dishapp.com/v1/graphql
```

## Filter by categories (restricted by radius)

`distance` is in degrees.

```
curl -H "Content-Type: application/json" \
  --data '{ "query": "query { \n
    restaurant ( \n
      where: { \n
        categories: {_contains: [\"Bubble Tea\", \"Chinese\"]}, \n
        location: { _st_d_within: { \n
          distance: 0.05, \n
          from: { \n
            type: \"Point\", \n
            coordinates: [-122.421351,37.759251] \n
          } \n
        }} \n
      } \n
    ) { \n
      id name location \n
    } \n
  }"}' \
  https://hasura.rio.dishapp.com/v1/graphql
```

## Most common dish types in region

```
curl -H "Content-Type: application/json" \
  --data '{ "query": "query { \n
    top_dishes( args: { \n
      lon: -122.42, lat: 37.7, radius: 0.1 \n
    }){ \n
      category frequency \n
    }}" }' \
  https://hasura.rio.dishapp.com/v1/graphql
```
