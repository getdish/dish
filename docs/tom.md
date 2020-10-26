# ranking

- ratio more important in ranking (not popularity contest)
  - options:
    - Option 1: bring back the concept of an overall ranking: 1-100% or 1-5 stars or something, this is our "ratio" rating
      - use ratio rating in search to avoid popularity contest
      - what this does:
        - ratios are nice to see "quality" vs popularity
        - being able to scan "99%" vs "92%" is much easier than "1200pts" vs "1500pts".
    - Option 2: weigh the rankings based on "most recent X points"

# keeping product focus

- runthrough frontend, document as many broken things as possible on all aspects as you see it
- runthrough a variety of searches and document all broken searches
- runthrough on improving source_breakdowns
- ideate on solution for tagging restaurants as hot/new
  - may want to tie this into discussion on new homepage

# finishing a succesful full new crawl

- fix yelp not crawling all reviews (slugs: coqueta, mong-thu-cafe)
- run big crawl bump price for now
- uber eats fix/crawl
- recrawl internal merge for sanfran
- (low priority) google crawler, caviar crawler

# validating/improving dish images

- generally validate our image tag matching, document our current stats somewhere of "tagged images"
- image quality API seems to not be super great
- add admin panel page for tracking some stats:
  - show count of # images found per-dish (avg per dish to start + total)
- test case to ensure lily image tag matching:
  - https://www.yelp.com/biz/lily-san-francisco

# important bugs/adjustments

- tag slugs
- BERT very slow - see /review/analyze, i'm seeing 10s+ response for matching just a single tag

# next features

- redo GPT3 summaries
  - table style:
    - | dish | rating | short summary |
- getting ready for v2 homepage
  - mapbox boundaries
  - how boundaries work with tilejson / tilejson viability research

# search quality (lower priority)

- plain text searches are coming up with just ok results
- "bobos" autocomplete not finding "bobo's"
- when i search for nopalito to try and find the restaurant with that name that has gpt3 - i think we can safely say "near exact match names" can rank highly for plain (non-tag) search http://d1live.com/gems/san-francisco/-/nopalito
- searching without tag is slow - try "birria taco" in sf
  - this is because of the full-text search across reviews and menu_items tables. there's a bit of research i could to improve the index. but maybe we need to look at a dedicated full-text engine. but remember that searching for tags is still as fast as ever

## Users

- User camera image upload endpoint that ties to a review of a single dish

## Monitoring

- More Grafana alerts

---

# Triage
-
## Low Priority

- [] Crawlers - Closed restaurants. Lucca's Ravlioli closed a year ago, maybe we just need to scrape that info from yelp et al (http://d1sh_hasura_live.com:19006/restaurant/lucca-ravioli-co-california/:dish?)
