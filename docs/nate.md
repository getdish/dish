- [c] [0] crawl one restaurant, fix
- [c] [0] test on ~10 restaurants
- [c] [0] recrawl tucson, la, sd, sf
- [m] [0] (restaurantpage) hours modal text error
- [m] [0] horizontal/vertiacal drag can get stuck moving between panes (noticed on search pane horizontal stuck)
- [m] [0] remove vote arrows on dishes
- [m] [0] cleanup searchpage spacing/styling
- [m] [0] super slow autocomplete item tap
- [m] [0] map doesnt go to bottom on drawer open sometimes
- [m] [0] (restaurantpage) many glitchy/layout fixes
- [m] [0] (restaurantpage) cant go into gallery
- [m] [0] (restaurantpage) dont do anything on change tag selected (scroll etc)
- [m] [0] (restaurantpage) quick fix (or remove if takes more than a few minutes) header horizontal scroll for images
- [m] [0] (restaurantpage) tap: address, phone, website get working
- [m] [0] (searchpage) cant tap vote on tag
- [m] [1] horizontal swipe on tags messes up drawer position
- [m] [1] swipe back to go back on drawer cards
- [m] [1] scroll UP should work when you are scrolled down on HOME, go to SEARCH, then go back to HOME, i think contentActive isn't being set or not propagating to scrolllock
- [m] [1] map zooms out every drawer shift
- [m] [1] speed up tag optimistic update
- [m] [2] remove fork list button on searchpage (non touch)
- [m] [2] re-search button should look like app menu button (bigger, shadow, blur, spaced bettter)
- [m] [2] too easy to move horizontal a little bit before moving vertical, in general the vertical/horizontal scroll fighting needs to be improved
- [m] [3] too much delay between open/close drawer and animate
- [m] [3] dragging drawer seems to drop frames in dev mode at least, useNative possible?
- [m] [3] map shouldn't shift down until touchend on drawer move
- [m] [3] stack drawer should be faster, "optimistic" show/hide before state
- [m] [3] login/signup animation is glitchy and slow
- [m] get login/signup working
- [m] [3] add apple sign in

---

- [a] [4] comments need voting or else no one will want to use them
- blog/signup
- LAUNCH

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
