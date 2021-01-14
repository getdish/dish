goal january

  1. fix lots of things

    - dont make region move map unless its initial load OR far outside map bounds
    - fix map jittering
    - map toggle between region/area improve
    - better search region
    - region handoff between search/home
    - fix restaurantpage click dish
    - cleanup restaurantpage a bit
    - router types not working on LinkButtonProps
      - also in homeStore.ts should work on the big pushHomeState switch
    - better intro / intro callout
    - touch / mobile web app runthrough fix scrolling issues
    - massive amounts of nav/search/autocomplete/comment/restaurant/gallery polish
    - location <=> url

  2. initial family/friends launch at end of month

    - have mailing list that actually emails once a month with new release
    - get site back up on live production and fix various issues
    - improve some profiles and some onboarding

  3. prototype playlists / improve home (bonus)

     - in general playlists are fun and affect regions a bit (may lessen need)
     - home page can be simpler and faster list, improve that

---

making it actually a community:

- lists
  - on restaurant page show prominently "lists this is on"
- commenting/review features need to be brought forward more and more fun
  - eventually threaded discussions esp on lists
  - could have comment section show just for each dish too
- home page needs to actually show real things / update better / etc
  - lists as cards + voting
- lots of core bugs in home/search/routing
- rating improvements / clarity in design
- probably a lot of fixes to data quality / imagery
- social social social
  - better showing of comments/trending on home
  - better flows and surfacing of user actions
- taste based matching
- an active blog with interesting updates

---

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

  - playlists for play
  - pokedex strikes the right balance: polished, personal, fun
  - trading cards - stats on each thing broken down, data driven, create "stacks" of favorite coffee shops
  - hitchhikers guide to the galaxy - whats unique, a place to store real opinion
  - ultimately the concerns wouldnt just be commercial like yelp or google, but also exploration, activity, outdoors, culture, history - wikipedia for a map
  - but the community aspect should drive it - "map reduce" from discussions into a "current best of page"
  - no great way to plan trips, to explore cities by what makes them great, long term goal is this
  - want to be on user side and not data mine, because we want people to trust they can really invest in curating their own adventure book.
    - able to post things privately, and have a "friends" scope
    - we are exploring paid-for models for upgraded features to avoid advertising pressures
    - want to invest in communities and have local champions, invest in local popups
  - by breaking down things by the factors that matter, not just a single 5 star ratings, we want to foster the japanese style in a sense - do "one thing well" - or the portland style of embracing quirkyness - let restaurants and shops avoid tyranny of the majority and specialize without negative effects

---

after alpha:

- revisit ssr
- show a list of hot & new restaurants on homepage, simple and easy win, with link to breakdown to comment easily...
- mobile web needs some sort of slight redesign

---

big impact changes

- social - having chef profiles
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

## bigger impact changes

- importing instagram and other feed data to have more aliveness
- top dishes <=> map pins + easily moving around cities.
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")

# Ratings

- Get experts on board
- have them easily rate/comment, etc
- Use them as profiles
