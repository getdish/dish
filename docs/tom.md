- smaller:
  - need to validate ratings aren't above 5, below 0
  - ensure the tags we have in the initial search autocomplete dropdown exist in db for next crawl (can just replace with tags that exist to save time step 1)
  - HASURA_GRAPHQL_JWT_SECRET seems like its just 12346... ? should secure that
  - profile page queries incredibly slow
  - prevent duplicate reviews from same person on single restaurant
  - dedupe restaurant images - i started on this @ getImageSimilarity
  - speed of search / discuss putting search.sql into the graph
  - searching tags should default to a grouped higher order tag, try "oysters" and you see a ton of different cuisine based categories, but there should be a meta category, just "Oysters", and the rest probably shouldn't show (but search should probably include all of them!)
  - "popup" tag would be fun to add and scan, so we can filter and show pop-up restuarants near you
  - add region to each restaurant directly - would be nice to show in the list.add modal and other areas

- bigger:
  - we need generic tags to work:
    - global__coffee instead of mediterranean coffee
    - global__curry instead of malaysian curry
    - global__oysters instead of namibian__oysters
    - global__wine instead of italian__wine
    - global__tea
    - global__boba
  - make sure global tags scan across all restaurants?

  - restoring infatuation / michelin crawlers

  - instagram images
    - links restaurant => intagram page, gets images
    - this is single biggest value add right now
    - could build it as a chrome extension that anyone can use once logged in
    - that way we could incentivize people to install it by giving them dish coin in the future
    - does all the requisite tag/scanning stuff on their descriptions as well would be nice

  - gpt3 summaries (elethuer)
    - take top "interesting" reviews, summarize using BERT first
    - then feed into gpt to get a cute one-sentence summary
    - use this for source_breakdown as well

  - gpt powered tag summaries
    - instead of using current sentment (or alongside it)
    - gpt has a "table" style demo in the openai admin panel
    - i have a demo saved that does the table breakdown for a tag as an example, so this would just be getting that to work

  - login via emailed link as an option

  - uber eats crawler

  - ML for us to auto-detect dishes! this will be fun but more future-facing, but cool demo so if we got it working good
    - script to export all dish-tagged images into local folders
      - folder name for each "cuisine__dish"
    - there's a microsoft ML desktop app i remember that just takes folders like that and auto-trains a classifier model

  - ML classify images: inside / outside / menu / close-up-hq-food
    - this could use the same exact setup as the above dish ML, just a folder for "inside" etc and we'd have to go in and grab a bunch

  - admin panel for crawling a specific subset of results using search or sql or list of tags

- merge app, worker, cron so we can test and run jobs while developing easily

- rate limit all mutations, tag ratings can be fast but for insert list/review should be limited a lot more (one every 3m or so)

- auto generate a few lists per region, basically re-create the top/unique tags for each region and then generate lists for them (under DishBot or similar fake user)

- infra
  - get backups back working
  - look at ensuring we can "survive initial beta" with what we have
  - goal for first month is not to get lost in here, focus on product

- beta features
  - email only login option
  - email setup for generally keeping up to date with users

- speeding up/simplifying dev
  - cron/migrate/worker/run-tests seem closely related could become one thing
  - search could fold into just app (more monolithic)
  - crawlers is more of a package than a service
  - ci/release improvements
    - having the [name]/dev branches release to a pr-based staging ENV *before* running tests would be a huge win for quickly testing
    - any obvious speed wins in CI really help
