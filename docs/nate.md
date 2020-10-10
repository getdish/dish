* The breakdowns popup on the results page flashes 3 times before
  showing the required values
* There's currently a discrepancy between the points we initially gave
  to a single review and the points we now give. Because we haven't done
  a full recrawl since this change, there's a mix of point factors in
  the DB. I've opted to use the current factor, which means a lot of
  restaurants won't seem to add up their points correctly. First thing
  is to do the recrawl. But secondly, this commit also includes an
  addition to the breakdown JSON that specifies the factor give to a
  single review at the time of aggreation, so this problem won't happen
  again.
* @natew I don't suppose the weights are relevant anymore?

---

Home page
- generally home page query and layout, but that's a whole other kettle of fish
- is the plan for the site to be login only? i think it's better to allow anonymous use of the site
Results page
- description and image for dish hardcoded
Restaurant page
- again dishes not ordered by their scores
- clicking a dish takes you to the gallery but there are no photos of that dish
- and the hardcoded breakdowns again too
- menu title show even when there's no menu
- menu doesn't contain prices or images

---

- tag voting fixes everywhere
- points breakdown real fixes
- admin panel fixes + fiverr cleanups
- slow scrolling because of mapbox?
- list item
  - show restaurant cuisine tags in overview
  - if michelin quote is availble, show that with michelin logo
- fix hmr for useStore in react native
- fix login/register flows
- get reviewing fully working with votes/sentiment on tags
- fix up points breakdown and dish/tag breakdown
- location <=> url

---

- the long run, a wiki of our world:
  - there exists no community map of the world
    - what happened to the atlas?
    - aggregation theory - theres no great aggregator of real world things - netflix for shows (originally), airbnb (places), craigslist (market), but for restaurants its just lots of individual sources like yelp, etc.
  - foursquare left us with no more fun community of curators
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


- blog post: A new world (of AI): personality in our online apps.
  - make the point that todays apps are very generic: designed to please everyone
  - Hitchhikers guide to the galaxy was prescient: AI can bring us *personality*
  - the biggest breakthrough (gpt3) is great at sarcasm, wit, humor
  - apps of the future will feel much more fun, personal, and human-like because of this
  - the biggest effect will be we'll look back and think the old internet was much more boring - wheres the fun?

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
