- site: words, sections, make it dishapp.com main page
- site: signup form, links to substack
- move rest of site to beta.dishapp.com with login required
- fix many data issues on specific restaurants
- re-run crawl successfully on SF
- run it on a bunch more places
- beta version that is testflight deployable
- mobile web various interaction fixes
- comments need voting or else no one will want to use them
- blog/signup
- LAUNCH

---

making it actually a community:

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

## bigger impact changes

- importing instagram and other feed data to have more aliveness
- top dishes <=> map pins + easily moving around cities.
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")
