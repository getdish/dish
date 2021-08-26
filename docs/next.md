- [a] [0] load new search in background
- [c] [0] test on ~10 restaurants
- [c] [0] recrawl tucson, la, sd, sf
- [c] [1] dedupe images
- [c] [1] tags move to single-primary image (highest quality)
- [c] [2] closed restaurants detection (i've seen a number of variants)
- [c] [2] get cron crawling every few days
- [i] [0] get backups uploading (postgres)
- [d] [1] test runthrough searching with keyboard at least ~3 fixes
- [m] [1] upload photos from app
<!-- - [m] [2] add ratings from photo upload -->
- [m] [1] get regions working (better)
- [m] [1] swipe back to go back on drawer cards
- [m] get login/signup working
- [m] [3] add apple sign in
- [m] [3] hover to color map circles in a group
- [a] [4] opengraph / meta / seo
- [a] [1] show favorites on map

---

# inbox

- auto create lists on voting will flesh out profiles

- getting search into graph will make a much better homepage possible and easier caching

- directions:
    - making lists more into articles
    - adding any type of item to the map

- duplicate image check, i beleive i started on this by adding a hash function that we could check against but didnt finish

- login/signup forms need a upgrade runthrough:
  - default to login if they have a cookie showing they've been logged in before
  - if they autocomplete the signup form, we can either move them to login or at least copy the values into login

- lists need a way to change the slug since we auto-generate it first. it should probably just do it one time, so need to track that in db (or some other way?).

- show little map markers with color/rating/(sometimes emoji)

- related good restaurants nearby on restaurantpage

- comments (list page, review)

- may want lists to have inline mentions in the body, or integrate the visual of listpage into the body (would also make a good listcard)

- location search show current region + parent region as an icon

- list.region => list.regions with insert hook to set using restaurants to power home showing more results

- discuss strict region on search page

- discuss final lenses: add "food" lense ?

- discuss merge app, worker, cron so we can test and run jobs while developing easily

- search by region on search pages is an seo upgrade

- searching tags should default to a grouped higher order tag, try "oysters" and you see a ton of different cuisine based categories, but there should be a meta category, just "Oysters", and the rest probably shouldn't show (but search should probably include all of them!)

- can likely merge all docker intranet apps into one .yml

- seeing the front of the restaruant in a wide angle shot is so key to intuitively finding a place you've been to !!

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

---

content ideas:

  - using company money to set up a fund initially to keep good lists coming
    - interview series with chefs (pick 5 places that mean something to you, tell a story)
    - michelin starred places
    - "definitive" guides to regions
    - "controversial" lists like "LA hands down beats SF in tacos, here's the comparison"
    - "informative" lists like "Why Mexican food fails in the bay, and why Asian food rocks" or "3 asian cuisines that are amazing in the bay, 3 that are better in LA" etc

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
