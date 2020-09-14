goals for this week, get us to being able to onboard people (not 100% necessary, but in order of importance):

- fix login/register flows
- get reviewing fully working with votes/sentiment on tags
- fix up points breakdown and dish/tag breakdown
- fix a lot of issues on mobile
- test in prod and in various browsers and fix up
- fix memory issues (see safari warning)
- user profile page improvement
  - show comments / votes separately
  - show users current favorites on the map
- start on blog post

next week:

- show a list of hot & new restaurants on homepage, simple and easy win, with link to breakdown to comment easily...
- blog
- location <=> url
- revisit ssr

---

big impact changes

- threading on comments is the only way you get discussion which leads to clarfiication, which is both what keeps people around and what allows us to get much richer info
- make map more alive
  - colors by category (cuisine?)
  - hovering a single restaurant should drop a pin on the map where it is
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

## GPT-3

- Dish Sentiment + summary for search results
- Each lense could get a summary too - Vibe / Drinks / Vegetarian
- Tips
  - when to go to beat the rush?
  - can you sit at the bar?
  - where to park?
  - pull out anything that mentions "tip"

## bigger impact changes

- importing instagram and other feed data to have more aliveness
- top dishes <=> map pins + easily moving around cities.
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")

# Ratings

- Get experts on board
- have them easily rate/comment, etc
- Use them as profiles
