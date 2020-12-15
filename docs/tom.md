  - admin panel for crawling a specific subset of results
    - for now i'm thinking limit it to SF + cuisine/dish:
      - vietnamese: pho, banh xeo, banh mi
      - mexican: taco, guacamole, salsa
  - fix/add final crawlers (google, uber eats, caviar?) on subset
  - see if any easy bugs to fix on user profiles
- product focused fixes from your previous runthrough
  - any major fixes for breakdowns (especially focused on subset)
- gpt3 better summaries
- a script to export images into labeled folders for ML training

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

- BERT very slow - see /review/analyze, i'm seeing 10s+ response for matching just a single tag

# next features

- redo GPT3 summaries
  - table style:
    - | dish | rating | short summary |

# search quality (lower priority)
- when i search for nopalito to try and find the restaurant with that name that has gpt3 - i think we can safely say "near exact match names" can rank highly for plain (non-tag) search http://d1live.com/gems/san-francisco/-/nopalito
- searching without tag is slow - try "birria taco" in sf
  - this is because of the full-text search across reviews and menu_items tables. there's a bit of research i could to improve the index. but maybe we need to look at a dedicated full-text engine. but remember that searching for tags is still as fast as ever

# images

- script to export all dish-tagged images into local folders
  - folder name for each "cuisine__dish"

## Users

- User camera image upload endpoint that ties to a review of a single dish

## Monitoring

- More Grafana alerts

---

# Triage
-
## Low Priority

- [] Crawlers - Closed restaurants. Lucca's Ravlioli closed a year ago, maybe we just need to scrape that info from yelp et al (http://d1sh_hasura_live.com:19006/restaurant/lucca-ravioli-co-california/:dish?)
