- blocking ios:install with RCT_NEW_ARCH_ENABLED=1
  - react-native-blur 4.1.0

- non-urgent but martin tileserver unmaintained, this one has same api
  - https://github.com/CrunchyData/pg_tileserv
  
  BACKEND ACTIONS / JOBS / CRON / TEST + CRAWLERS
    
    - `dish action crawl_all` (@services/worker + @services/cron)
    
    - create:
      - /worker/cron.ts
      - /api/crawl.ts
      - /api/backup/db.ts
      - /api/crawl/yelp.ts
        - /crawlers/Yelp.ts

    - delete:
      - services/cron
      - services/worker
      - services/crawers

    - `dish action run_crawl`

    - parse /actions/ => bull-queue actions and run in worker
    - move crawlers service into app
    - `dish test api/crawl/yelp`
    - `dish POST /api/crawl/yelp`
    - `dish test run_crawl` (finds run_crawl) || `dish run actions/hourly/run_crawl`

- worldwide boundaries for country / state:
  - https://www.naturalearthdata.com/downloads/
  - https://gadm.org/

- add tests inline with any file (see vitest)

- move the mostly "monitoring" shit into /backoffice
  - alertmanager, grafana, pg-admin, prometheus, swarmprom

- remove gorse

- use react-freeze for inactive panes
  - https://github.com/software-mansion/react-native-screens
  - https://github.com/software-mansion/react-freeze

high level:
  - fix crawlers and get running again
  - get osm data imported for worldwide coverage
  - get native app to usability
  - make listing, profiles, home better
  - make listing, adding favorites, simple discovery beautiful

- list cards would be really nice on native/mobile if they had a swipe to see them. swipe right to see first item. like instagram gallery photos. would work nicely on desktop too and look pretty nice.

- osm data

- restaurantpage vertical top tags / top dishes lists

- lists better tag rating design, make it a bit bigger and more interesting, maybe via TagButton size="xl"

- photo upload for reviews
  - profile page feed of recent photos
  - home page feed of recent photos in that region
  - stories like design

- homepage get it a bit more alive and rich
  - show other regions nearby
  - see about trending_restaurants trending_tags top_dishes things
  - feed of recent activity

- delete tag rating

- lists need a way to change the slug since we auto-generate it first. it should probably just do it one time, so need to track that in db (or some other way?)

- auto create list regions from restaurants

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

- 0.5 ratings or granular ratings
- make inserting tags possible
- make it alive:
    - follow people (+ follow in list page)
    - feed of who you follow
    - discussions within lists
    - auto-lists based on your votes
    - communities
    - more interesting dishes to explore
        - quesabirria
    - this flow:
        - favorite dishes like quesabirria
        - home now shows relevant favorites nearby thats open_now by default
        - home shows quick links to search my favorite dishes/cuisines
- align columns for tag ratings
- Reset password: SyntaxError: The string did not match the expected pattern.
- import osm and integrate into list search

- [m] [0] (restaurantpage) tap: address, phone, website get working
- beta / invite features

- go into other verticals

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

- [c] [0] test on ~10 restaurants
- [c] [0] recrawl bay area
- [c] [1] dedupe images
- [m] [1] upload photos from app
<!-- - [m] [2] add ratings from photo upload -->
- [m] [1] get regions working (better)
- [m] [1] swipe back to go back on drawer cards
- [m] get login/signup working
- [m] [3] add apple sign in (expo has library)
- [m] [3] hover to color map circles in a group
- [a] [4] opengraph / meta / seo

---

# inbox

- adding in OSM data for any location

- auto create lists on voting will flesh out profiles

- directions:
    - making lists more into articles
    - adding any type of item to the map

- show little map markers with color/rating/(sometimes emoji)

- related good restaurants nearby on restaurantpage

- location search show current region + parent region as an icon

- restaurant.regions

- list.region => list.regions with insert hook to set using restaurants to power home showing more results

- hooking sentiment analysis realtime as people are writing reviews so it pulls out suggested tag ratings for them

- discuss final lenses: add "food" lense ?

- search by region on search pages is an seo upgrade

---

content ideas:

  - using company money to set up a fund initially to keep good lists coming
    - interview series with chefs (pick 5 places that mean something to you, tell a story)
    - michelin starred places
    - "definitive" guides to regions
    - "controversial" lists like "LA hands down beats SF in tacos, here's the comparison"
    - "informative" lists like history on a cuisine, area, technique, "Why Mexican food fails in the bay, and why Asian food rocks" or "3 asian cuisines that are amazing in the bay, 3 that are better in LA" etc

  - setting up more automated ways for people to see bounties or payouts for certain types of content. a bounties page essentially for listers to go to and earn some money.

  - hooking in analytics such that we can automatically suggest interesting topics for people. think of it as a sort of data-analytics team within a newspaper, but public as more of an analytics dashboard we build and improve

bring the app "to life":

  - more interactivity:
    - map shows favorites instantly (map needs a way to have "background" points that are unintrusive (extra hover delay to activate, on mobile zoom needs to be higher))

  - home map needs to load points/regions faster and better
    - secondary points, hover effects, colorized by type, emoji for standouts
    - load next search points on map move and show them dimmed on map
  
  - more social stuff overall
    - home showing better profile info, userpages far nicer

  - more interesting tags on the home

  - ensure interesting lists on home
  
  - incentives made fun/clear
    - show "desired" lists and other info clearly

  - fun light notification bubbles + more feedback

incentivizing good content:

  - being able to airdrop tokens for certain lists that meet thresholds

  - show "desired" things clearly

  - we need a way to figure out interesting tags and have them grow and organically tie into making lists. eg:

    - "friendly bathroom"
    - ""
    - "quality decaf"

---

# search quality (lower priority)
- when i search for nopalito to try and find the restaurant with that name that has gpt3 - i think we can safely say "near exact match names" can rank highly for plain (non-tag) search http://d1live.com/gems/san-francisco/-/nopalito
- searching without tag is slow - try "birria taco" in sf
  - this is because of the full-text search across reviews and menu_items tables. there's a bit of research i could to improve the index. but maybe we need to look at a dedicated full-text engine. but remember that searching for tags is still as fast as ever

---

- [a] [4] comments need voting or else no one will want to use them
- blog/signup
- LAUNCH

---

- after sign in we need to route them somewhere so browser will prompt "remember password"
- discussions
  - add comment => show comment
  - upvote/downvote comments

- useStoreOnce() => useStoreEphemeral()
  - see `stores` global gets polluted
  - make it so it *shares* the stores *while 1 or more are active*
    - but then once the last one unmounts it clears memory
  - TagVoteStore => portal

---

big impact changes

- show comments everywhere (search, home, lists)
- threading on comments is the only way you get discussion which leads to clarfiication, which is both what keeps people around and what allows us to get much richer info
- make map more alive
  - hovering a group can make those bubbles get preference and enlarge
  - hover restaurant show it on map (but without moving it, maybe marker zoom)
  - liking a restuarant could drop a heart
  - emoji icons once you get to a zoom level
- home needs to feel more like a discussion
  - so do all other pages
  - basically do a sprint on bringing out discussions
    - for EACH SOURCE pick and show 2 positive, 2 middle, 2 negative
- some sort of way to see categories of things on the map quickly
  - home page hovering a section could show all the restaurants within that section
    - is there some generic way we can then make this a feature "highlighted group of restaurants for map"?s
- Admin icons multiselect
- "explore mode" or "auto re-search" basically just have map research as you move

making it actually a cool:

- when you upvote something, have a chance to add it to your "top list"
- expand into not just restaurants
  - index other things
  - lists should account for type
  - expand the lenses into subreddits basically
    - lense can decide it's "type"
      - restaurant, activity, everything, etc
    - let anyone create a lense (must be unique)
    - popular lenses show at top (can search them)
- commenting/review features need to be brought forward more and more fun
  - eventually threaded discussions esp on lists
  - could have comment section show just for each dish too
- eventually have just discussions be a thing in general
  - push more towards home being reddit-like
- home page needs to actually show real things / update better / etc
- lots of core bugs in home/search/routing
- probably a lot of fixes to data quality / imagery
- social social social
  - better showing of comments/trending on home
  - better flows and surfacing of user actions
- taste based matching
- an active blog with interesting updates

---

- top dishes <=> map pins + easily moving around cities.
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")
