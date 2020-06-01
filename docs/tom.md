# June

Week 1

- [ ] Search results
  - [ ] Search should sort by tags!
    - [ ] Dish should override country, etc
  - [ ] Smoothing ratings - use restaurant overall
  - [ ] Showing the dish tag on search results first always
  - [ ] Fleshing out dish tags
    - [ ] Using menu_items to find dishes as well
      - [ ] if no image, we can use an image from any other tag! just fallback to some other restaurant image
    - [ ] Use photos to find them as well

Week 2

- [ ] Dish data / dish ratings
  - [ ] we really need better dish ratings / dish finding
    - [ ] Some looser matching of user comments / sentiment
    - [ ] Ambiance / Service filtering
      - [ ] Ratings that directly mention service/ambiance should be processed differently
        - [ ] We can detect these through simple keyword analysis?
          1. the star rating should be _not_ counted, instead:
          2. take sentiment analysis toward (service + ambiance) separately, and use those in our UI (tags! Service tag + Ambiance tag)
          3. this can be done on all reviews eventually basically

Week 3

- [ ] can we crawl menus from more places - does it help towards dishes?
  - yelp, google, tripadisor, infatuated
  - menu data is actually really nice if we can merge it with dish data in the UI so i can show a full menu, and pull in images if they exist
- [ ] Delivery service crawlers

Week 4

- [ ] Image crawling - image selection improvements
  - [ ] Google or instagram, both ideally!
- [ ] Various features for "completeness"
  - [ ] If we can find an easyish pre-packaged docker image / library for ML we can use to summarize all the comments into little "snippets" like yelp/google do, that would be a big win in the UI

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

# Search

we basically just need to improve the tags we show and the dishes we show:

- [ ] match dishes to search query/tags as best as possible, sort by top
- [ ] can you get me simple example of query of top tags that arent dishes for each restaurant? i guess the search api returns this now but can we make that materialized? i understand making tons of sql calls per-search is not great though so if that seems like it may be a problem lmk.

# Data

- [ ] Delivery services is really important: Uber Eats, Caviar, DoorDash, GrubHub, just getting basic info from all would be > getting detailed from a couple.
- [ ] Images - google would be great here, but also, would be great to choose high quality images, would make a _huge_ difference in the UI. We could even then use callout images for headers that really make a big diff in visual.
  - [ ] I would _love_ an instagram crawler that somehow found their instagram and pulled in images. You'd be surprised how many restaurants have this set up, and it'd make our imagery really next level. Plus would open us up to having really rich and nice Restaurant info: imagine we can show "latest updates" inline with images + text and link to their insta.
- [ ] Beyond that, just the unsexy but huge amount of data massaging, I understand that will be a lot

# Ratings

I mostly want to wait and see how they look once data comes in, I think having a few experts combined is a big boost. My second strategies to improve would be various sentiment finding improvements, such as filtering out things that mention "bad service" etc really directly.

Once community comes online we can weight their ratings a lot higher and see how it goes, and that may be good enough.

## Autocomplete

- [ ] Can you get me an example / materialized view / endpoint for then autocompleting ONLY dishes from a specific cuisine?

## Backend

- [ ] Password protect Redis server
- [ ] Endpoint for more advanced searching
- [ ] be able to pass in Taxonomy as filters
- [ ] returns Restaurant, Dish, Taxonomy.searchable, we can just do multiple requests/grouped to start

## Indexing

- [ ] Finally, Foursquare actually has the best quality rankings I think. Their apps are old and they dont search delivery, otherwise they would just be obviously the best choice. In fact, I think a lot of people are clutching onto foursquare because they are the best, but if we had similar rankings but just delivered nice apps with delivery search and a sort of message of "were doing this!" we are good. That said, crawling foursquare may be more important than google or other sources i think.
- [ ] Use Dish account for AWS proxies
- [ ] Use Dish account for HereMaps/Geolocator API
- [ ] Fix all the minor Sentry exceptions
- [ ] Start crawling Berlin
- [ ] Bull memory leak? Manually delete completed jobs?
- [ ] Explore better overview UI, Bullboard isn't cutting it

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
