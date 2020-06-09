# June

TL;DR:

- Better ratings through smoothing/sentiment
- Better ratings through ambiance/service sentiment
- Delivery crawlers
- Image/other crawlers (Instagram/Google)
- Better dish finding through images/comments
- Summarized tips/comments (see RestaurantTopReview)
- Search performance

✔️ : Done
👷: Currently or will actively work on
⚠️ : Not prioritising


Week 1

- Search results
  - Search should sort by tags! ✔️
    - Dish should override country, etc ✔️
  - Smoothing ratings - use restaurant overall
  - Showing the dish tag on search results first always ✔️
  - Fleshing out dish tags
    - Using menu_items to find dishes as well 👷
      - if no image, we can use an image from any other tag! just fallback to some other restaurant image ✔️
    - Use photos to find them as well ⚠️ not impossible just not so easy to give it priority
- Dish data / dish ratings
  - we really need better dish ratings / dish finding
    - Some looser matching of user comments / sentiment ⚠️ could you expand on this?
    - Ambiance / Service sentiment
      - Ratings that directly mention service/ambiance should be processed differently ⚠️ quite complicated so will not make a priority
        - We can detect these through simple keyword analysis?
          1. the star rating should be _not_ counted, instead:
          2. take sentiment analysis toward (service + ambiance) tags separately, and use those in our UI (tags! Service tag + Ambiance tag)
          3. this can be done on all reviews eventually basically
    - be sure to use the NON-ambiance/service review as the base for smoothing dish tag reviews! should really improve it.
- Crawlers
  - delivery crawlers would be great
- Autocomplete endpoint to get ONLYs dishes from a specific cuisine (If I'm in Vietnamese it return "Pho", etc)?
- One big missing piece that would make the whole ui better: top_comment 👷 such a great idea
  - having top comments for tags would be even bigger
- [reserved for various productionizing work]

Week 2

- Location endpoint: can we get nearby regions easily? ⚠️ if so would be helpful what defines a "region"?
- Performance check - search/home has seemed slow
- Crawlers!
  - Delivery crawlers 🚚 👷
  - Google for images/reviews 👷
  - Instagram v1 ⚠️ hardest thing is matching accounts to restaruants

Week 3

- Menus from more places
  - yelp, google, tripadvisor... 👷
  - menu data is actually really nice if we can merge it with dish data in the UI so i can show a full menu, and pull in images if they exist ✔️ just need to form the right graph queries
- Menu => Dish and Image => Dish improvements
  - we can likely do a ton of small things to better pull out dish images, dish reviews, etc:
    - from image comments ✔️⚠️ already doing this, there are other sources, but it's tricky
    - menu items can help us add dish tags 👷
    - partial matching dish names for sentiment ⚠️  can you expand on this?
- Delivery service crawlers 👷

Week 4

- [reserved for various productionizing work]
- Top comments!
  - For dishes, restaruants, potentially even tag
    - use some off-the-shelf ML to make it cool? (initial research doesn't reveal anything obvious)
    - perhaps showing (1 positive + 1 negative)? (summarisation is certainly available, summarised negative sentiment could be tricky)
- Image crawling - image selection improvements
  - Google or instagram, both ideally! 👷
- Various features for "completeness"
  - If we can find an easyish pre-packaged docker image / library for ML we can use to summarize all the comments into little "snippets" like yelp/google do, that would be a big win in the UI (nothing immediately stands out here :/)

# Triage

- Trending restaurants (for home)

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

# Data

- Delivery services is really important: Uber Eats, DoorDash, GrubHub, (Caviar distanct last) just getting basic info from all would be > getting detailed from a couple.
- Images - google would be great here, but also, would be great to choose high quality images, would make a _huge_ difference in the UI. We could even then use callout images for headers that really make a big diff in visual.
  - I would _love_ an instagram crawler that somehow found their instagram and pulled in images. You'd be surprised how many restaurants have this set up, and it'd make our imagery really next level. Plus would open us up to having really rich and nice Restaurant info: imagine we can show "latest updates" inline with images + text and link to their insta.
- Beyond that, just the unsexy but huge amount of data massaging, I understand that will be a lot

# Ratings

I mostly want to wait and see how they look once data comes in, I think having a few experts combined is a big boost. My second strategies to improve would be various sentiment finding improvements, such as filtering out things that mention "bad service" etc really directly.

Once community comes online we can weight their ratings a lot higher and see how it goes, and that may be good enough.

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
