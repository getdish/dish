biggest impact changes before sending:

- Voting, tagging, commenting improvements
- map fixes
  - clicking a single point when not on search page should nav to restaurant itself
- make map more alive
  - colors by category (cuisine?)
  - hovering a single restaurant should drop a pin on the map where it is
  - hovering a group can make those bubbles get preference and enlarge
  - hover restaurant show it on map (but without moving it, maybe marker zoom)
  - liking a restuarant could drop a heart
- home needs to feel more like a discussion
  - so do all other pages
  - basically do a sprint on bringing out discussions
    - for EACH SOURCE pick and show 2 positive, 2 middle, 2 negative
- write review working + sentiment + tag votes there
- fix upvote/downvote again
- mini breakdown items links to opening detail, detail opens in new tab
- add comment working with sentiment
- some sort of way to see categories of things on the map quickly
  - home page hovering a section could show all the restaurants within that section
    - is there some generic way we can then make this a feature "highlighted group of restaurants for map"?s
- sometimes going home doesnt zoom out - but not alaways
- location <=> url
- safari feels slow
- apple login? (expo auth?)
- A bit of user profile page polish
  - show favorites on the map!
- dish rating breakdown
- React Native app
- revisit ssr
- Admin icons multiselect
- "explore mode" or "auto re-search" basically just have map research as you move

---

small:

- Fix <Dish /> type remove TopCuisineItem weird type and change to tag, but maybe split into to <DishFromTag />, <DishFromRestaurant /> or similar
- autocomplete = higher ranking higher

## Open GPT-3

- Dish Sentiment + summary for search results
- Each lense could get a summary too - Vibe / Drinks / Vegetarian
- Tips
  - when to go to beat the rush?
  - can you sit at the bar?
  - where to park?
  - pull out anything that mentions "tip"

## bigger impact changes

- add comment + rate being really slick
- importing instagram and other feed data to have more aliveness
- top dishes <=> map pins + easily moving around cities
  - mapbox...
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")

# Ratings

- Get experts on board
- have them easily rate/comment, etc
- Use them as profiles
