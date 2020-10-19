- fix latest build issue
- ratio more important in ranking (not popularity contest)
- fix yelp not crawling all reviews (slugs: coqueta, mong-thu-cafe)
- add test case for lily image tag matching:
  - https://www.yelp.com/biz/lily-san-francisco
- take a deep dive fixing crawl:
  - look at memory issues, really take a deep dive for one day
  - try and bring down cost


- incorporate popular tags and high/low sentiment, high/low tag-mentioning reviews into restaurant.summaries (edit)
  - specifically, should be separate from "summary" ("ratings_summary" may be fine)
  - should return an object like so:

```
{
  "yelp": {
    "vibe": {
      "points": 100,
      "positive": "",
      "negative": "",
    },
    ...otherTags
  },
  ...otherSources
}
```

Notes:
  - Avoid having this get to be too huge, limit number of tags, limit length of highlighted sentence

- redo GPT3 summaries
  - table style:
    - | dish | rating | short summary |

- improve images:
  - we really need to fix our "deepest" flow, images/gallery, but in order to fix it really we need to match a lot more images to dishes.
    - how do we query for dish images? and then be able to get the "rest" of the images in a clean way (non-dish-images)? we may want to think/iterate here
  - part of this may be just crawling google if they do provide tagged images
  - alternative is starting to train a neural net for detection of certain things, we can also build an interface to help us tag images quickly
  - not sure what else we can do really here, but likewise it would be nice to split out "inside" and "outside"
  - futher, getting the image quality api to be even better (can we sort by quality? basically, ensuring truly high quality images are selected first makes a huge diff)




- explore the ongoing memory issues with the internal crawler
- look into empty restaurant.headlines bug
- google crawler
- crawl new cities in san fran area
- recrawl internal merge for sanfran
- improve local dev setup (edited)
- when i search for nopalito to try and find the restaurant with that name that has gpt3 - i think we can safely say "near exact match names" can rank highly for plain (non-tag) search http://d1live.com/gems/san-francisco/-/nopalito
- some restaurants have good scores, good dishes, but no headline review, must be a bug
- onboard fiverr worker with instructions on admin
  - set up permissions and an account for them
  - add a way to set the wiki description
  - try and fix any bugs with saving/editing
  - instruct them to clean up names and icons basically
- searching without tag is slow - try "birria taco" in sf
  - this is because of the full-text search across reviews and menu_items tables. there's a
    a bit of research i could to improve the index. but maybe we need to look at a dedicated
    full-text engine. but remember that searching for tags is still as fast as ever

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
