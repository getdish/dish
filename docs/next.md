realtime map mvp
  - pre-load just coords + name + (cuisine tag, top tag) for each region on map (going outwards better)

- searchpage: making overview look like dishbot commentbubble
- load next search points on map move and show them dimmed on map

- [a] [0] load new search in background
- [c] [0] test on ~10 restaurants
- [c] [0] recrawl tucson, la, sd, sf
- [c] [1] dedupe images
- [c] [1] tags move to single-primary image (highest quality)
- [c] [2] closed restaurants detection (i've seen a number of variants)
- [c] [2] get cron crawling every few days
- [i] [0] get backups uploading (postgres)
- [d/m] [0] onboarding runthrough and fixup
- [m] [0] move region then search goes to prev region
- [m] [0] go to diff region and return to one sometimes has empty list cards (graphql caching logic issue)
- [m] [0] (restaurantpage) hours modal text error
- [m] [0] (restaurantpage) cant go into gallery
- [m] [0] (restaurantpage) dont do anything on change tag selected (scroll etc)
- [m] [0] (restaurantpage) tap: address, phone, website get working
- [m] [0] (searchpage) cant tap vote on tag
- [d] [1] test runthrough searching with keyboard at least ~3 fixes
- [m] [1] upload photos from app
<!-- - [m] [2] add ratings from photo upload -->
- [a] [1] fix profile pages a lot
- [m] [1] get regions working (better)
- [m] [1] swipe back to go back on drawer cards
- [m] get login/signup working
- [m] [3] add apple sign in
- [m] [3] hover to color map circles in a group
- [a] [4] opengraph / meta / seo

---

# inbox

- searching tags should default to a grouped higher order tag, try "oysters" and you see a ton of different cuisine based categories, but there should be a meta category, just "Oysters", and the rest probably shouldn't show (but search should probably include all of them!)

- can likely merge all docker intranet apps into one .yml

- seeing the front of the restaruant in a wide angle shot is so key to intuitively finding a place you've been to !!

- HASURA_GRAPHQL_JWT_SECRET seems like its just 12346... ? should secure that

- validating/improving dish images
  - generally validate our image tag matching, document our current stats somewhere of "tagged images"
  - image quality API seems to not be super great
  - add admin panel page for tracking some stats:
    - show count of # images found per-dish (avg per dish to start + total)
  - test case to ensure lily image tag matching:
    - https://www.yelp.com/biz/lily-san-francisco

- admin panel for crawling a specific subset of results using search or sql or list of tags
- fix/add final crawlers (google, uber eats, caviar?) on subset
- see if any easy bugs to fix on user profiles

- script to export all dish-tagged images into local folders
  - folder name for each "cuisine__dish"

- redo GPT3 summaries
  - table style:
    - | dish | rating | short summary |

# search quality (lower priority)
- when i search for nopalito to try and find the restaurant with that name that has gpt3 - i think we can safely say "near exact match names" can rank highly for plain (non-tag) search http://d1live.com/gems/san-francisco/-/nopalito
- searching without tag is slow - try "birria taco" in sf
  - this is because of the full-text search across reviews and menu_items tables. there's a bit of research i could to improve the index. but maybe we need to look at a dedicated full-text engine. but remember that searching for tags is still as fast as ever


---

- world map lists (top 100 X worldwide) would really show it off

---

better docker setup:

- avoids need for registry entirely
- can parallelize all tests

1. add to ci: - /var/run/docker.sock:/var/run/docker.sock
2. need to make run-tests image have docker installed inside it
3. remove setup_services from pipeline
4. make run-tests run setup_services instead
5. use a different network in run-tests to avoid overlap
6. make yarn test:parallel-only that runs all parallelizable tests at once
7. make run-tests run test:parallel-only
8. (see package.json testConfig) make run-tests have a script to get all the rest of the tests that can't be parallelized


---

- [a] [4] comments need voting or else no one will want to use them
- blog/signup
- LAUNCH

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

- after sign in we need to route them somewhere so browser will prompt "remember password"
- home page with "delivery" and other filters? want to encourage that you can search across delivery from there
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
- showing the icons for top/vibe/bar/green on list items with one click vote
- threading on comments is the only way you get discussion which leads to clarfiication, which is both what keeps people around and what allows us to get much richer info
- make map more alive
  - colors by category (cuisine?)
  - hovering a group can make those bubbles get preference and enlarge
  - hover restaurant show it on map (but without moving it, maybe marker zoom)
  - liking a restuarant could drop a heart
  - emoji icons once you get to a zoom level
  - speeding it up in general
- adding in hot & new / popups / instagram
  - basically, social features
- home needs to feel more like a discussion
  - so do all other pages
  - basically do a sprint on bringing out discussions
    - for EACH SOURCE pick and show 2 positive, 2 middle, 2 negative
- some sort of way to see categories of things on the map quickly
  - home page hovering a section could show all the restaurants within that section
    - is there some generic way we can then make this a feature "highlighted group of restaurants for map"?s
- Admin icons multiselect
- "explore mode" or "auto re-search" basically just have map research as you move

---


### Generally making the stack a lot easier to work with.

On a high level:

#### Reducing complexity

- reduce services/images:
  - worker, cron, run-tests: these images have big overlap, combine into one
  - search => dish-app
  - make base image lighter ? avoiding deps building in the beginning

#### Improving access

- UI for databases: timescale + postgres thats ideally in dish-app/admin

#### Local development

- mounting local code folders and hot reloading
- Ideally should be able to run against some sort of "personal" instance thats in the cloud but you have shell access into

#### Automate failure and recovery modes better

- Crawls should detect when failures are happening at a high rate and cancel the rest of the crawl

---


- importing instagram and other feed data to have more aliveness
- top dishes <=> map pins + easily moving around cities.
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")

---

2021-04-07T18:53:00.250Z b8db66e9 lax [info] Processing job (22428, attempt: 1): GrubHub.getRestaurant(["2285758"])
2021-04-07T18:53:00.263Z b8db66e9 lax [info]   {
2021-04-07T18:53:00.263Z b8db66e9 lax [info]  [gqless] errors [
2021-04-07T18:53:00.264Z b8db66e9 lax [info]     "extensions": {
2021-04-07T18:53:00.265Z b8db66e9 lax [info]       "path": "$.selectionSet.insert_restaurant.args.objects",
2021-04-07T18:53:00.266Z b8db66e9 lax [info]     },
2021-04-07T18:53:00.266Z b8db66e9 lax [info]       "code": "constraint-violation"
2021-04-07T18:53:00.269Z b8db66e9 lax [info] ]
2021-04-07T18:53:00.269Z b8db66e9 lax [info]   }
2021-04-07T18:53:00.269Z b8db66e9 lax [info]     "message": "Uniqueness violation. duplicate key value violates unique constraint \"restaurant_name_address_key\""
2021-04-07T18:53:00.278Z b8db66e9 lax [info] Error: Uniqueness violation. duplicate key value violates unique constraint "restaurant_name_address_key" (sentry)
