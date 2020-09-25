
- voting on dish tags / voting in general
- slow scrolling because of mapbox?
- list item
  - show restaurant cuisine tags in overview
  - if michelin quote is availble, show that with michelin logo
- fix hmr for useStore in react native
- fix login/register flows
- get reviewing fully working with votes/sentiment on tags
- fix up points breakdown and dish/tag breakdown
- location <=> url

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

## GPT-3

- build a summarizer:
  - for 10 restaurants of diverse cuisine:
    - collect 10 diverse reviews:
      - put them all concatted together above
      - then put """, then write a fun, funny, short summary calling out a few unique things from the reviews
  - then collect 5 more restaurants of different cuisines, 10 reviews each:
    - see if it summarizes them nicely
  - plug into actual app for top X restaurants
    - maybe do it based on homepage results so they are likely to see

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
