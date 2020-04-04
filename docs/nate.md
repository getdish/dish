next

SEARCH + TAGS

- may need to redo how router/navigate work?
  - instead of using router directly
    - `.home.addTag(Tag)` `home.removeTag(Tag)`
- tag-urls `/:tag1/:slug1/:tag2/:slug2/:tag3/:slug3` or similar
- send tags in search
- show tag icons if available on search results page title
- lense bar should then just push the url

cool touches:

- left/right on autocomplete slides between results

---

- fix some of routing, map-pin issues
- fix RatingView style issus on <90
- make TagPopover work
- Popovers respond to esc key
- Popovers prevent clicking above content bug
- Double esc to go back from Restaurant
- Autocomplete - go straight to restaurant if restaurant
- add in location search to autocomplete
- add in location search to location textinput
- fix bug going back to search re-runs search (again)
- search loading state indicator
- move map should re-run search but show an option to update it
  hovering a restaurant in searchresults should show a bottomarea preview - a nice quote with information on that restaurant (summary - that peach can fill in) - moving the hover to the dish images should then switch it over to showing - the dishes
- basic keyboard for searchresults movement
- test enabling Suspense for much faster rendering

next:

web:

- images v2

  - no more scrollable horizontal carousel on listitem
  - no more scrollable vertical images on detail
  - listitem - hover image and it replaces map side with image gallery/grid
  - detail - bottom section shows top dishes in design + row of images below, BUT
    - the entire section is just one hoverable area
      - hover shows the same right-side image gallery
    - dealbreaker
      - map has to move to pip then i think until you close or else its too awkward

- RestaurantDetail
  - gallery
  - social media links
  - hover tooltips for: address (gmaps/maps links)
- bugs
  - going back from restaurant to search is re-running search
- map
  - loading spinner on the map or on right of searchbar as you move (and for regular search)
  - move map should filter current results down and re-number
  - map click item scroll to item / view detail
  - moving map in general as you go forward/backward isn't smooth/consistent
- search
  - current location / permissions access
  - search locations
  - RestaurantListItem
    - upvote/downvote (improve buttons, hover)
    - ratings window improve (easier to close on click away + x close button + saving spinner)
    - click address, menu, phone
    - hover "closed until" to show full hours
    - delivery button/hover to see services/names
    - horizontal scroll (load more on scroll, show one to start)
    - click image to go right into gallery
    - working tag buttons that link to show that category
- keyboard navigation for everything
  - lots of input focus work: after clear search, rating view open, etc
- 404 better pages (click home carousel "Pancho Villa" it breaks)
- preloading would help in many interactions
- a few performance runthroughs

---

Keys to launch:

- Really focus on SHOWING "this is the best in SF" on initial load
- Bring out dishes in UI and make sure ratings by dish work well
- Ratings improvements
- Search across all delivery services

---

# Ratings Improvements

- https://www.freecodecamp.org/news/whose-reviews-should-you-trust-imdb-rotten-tomatoes-metacritic-or-fandango-7d1010c6cf19/

One thing to note first, there are technically two types of ratings (restaurant, dish).

Assume our baseline reviews are just a bit better than Yelp/Google at 60%, ways I see we can improve:

- Experts: get a cabal of experts to join and submit ratings

  - (prior) +accuracy ~20%
  - can we then use them to filter out "poor taste" from other review datasets?
    - (prior) +accuracy 5-20%
    - depending on how you do it could be very useful or not much

- Prune-non-food: remove reviews that mention bad service, ambiance, waiters, etc etc

  - (prior) +accuracy ~15%

- Dish-level: extract dish-specific mentions for positive or negative sentiment from existing reviews
  - (prior) +accuracy ~10% for restaurants, but a lot for dishes

## Thoughts behind

My prior for starting dish is basically that "ratings accuracy" for actual food for Yelp/Google is at about 60%. I think infatuated may be closer to 70%, michelin close to 95% (but for only a couple thousand), the delivery services 30%.

We want to bring that up to 90%+.

In other industries you see ratings aggregators that consistently are very accurate. The best example is Rottentomatoes, so much so that theres a massive quora thread debating if its declines in recent years (https://www.quora.com/Has-Rotten-Tomatoes-become-less-reliable-overinflated-in-recent-years-2015%E2%80%9317-Has-Rotten-Tomatoes-become-too-agenda-driven-to-be-reliable).

- [https://develop.consumerium.org/wiki/Lists_of_review_aggregators_and_review_sites]

Why I like rottentomatoes

- mostly, they consistently match my expectations, and most importantly, their 90%+ movies are maybe 95% accurate (granted, i assist them a lot by not seeing any movie that i know doesnt appeal to my current mood, but in dish's case users would do the same thing - theyd know if theyre craving sushi already, whereas mood for movies is more complex)
- 0-100 scale is more memorable and precise, I've thought on this for a while and I like it for restaurants i think (you'd also show #1, #2, #3...)
  - to me, its nice to see 92 vs 95 vs 98, i actually sense big differences in that range. in the lower tiers i don't mind...
  - only downside would be does it confuse the ratings too much or feel to foreign to people?
- anything above a 85% or so is "gold", similar to the idea of having a "star" or no star show / crown etc
  - nice for handing out for promo - we're a "\*" restaurant!

Rottentomatoes is even interesting because they split out experts from the audience.

---

ios:

- make the dishlistitem tap => dish search results better transition
  - swipe back
- show our sub-ratings inside restuarant view: michelin, infatuated, etc
- tap image in DishListItem to go straight to gallery
- fix map positioning
  - moving back to center bug again
  - dont always zoom into tapped pins
- restaurant individual view
  - scrollable vertical image gallery
  - only info on top, sprint on showing better info
- search/map loading spinner while searching / dim out previous results
- bugfix drawer moves up when you scroll down
- get search autocomplete interface integrated
- tapping on map grouping should show those selected results at bottom
- tap location search selects search text
- location search returns locations on search
- tap account/camera moves to left/right + move camera into right
- search has a separate list interface for showing more than just dishes
  - shows restaurants as well
  - shows locations as well and tapping changes location bar instead
- image gallery for restaurant images
- voting mechanism
- camera capturing images
  - save to camera roll automatically
  - share button that works
  - review popover on capture
- account pane
  - working signup/login
  - show account information/menu on logged in
  - logout
- final splash
- welcome popup
- map
  - Ratings on map? important to figure out
  - Cuisines colored on map?
- peek card at bottom when tapping on individual restaurant
  - pull it up to see full restaurant card
  - lets you swipe between images easily
  - tap brings up gallery view

Idea for really sexy things that will catch attention (later):

- Camera shows current guessed restaurant name at top and lets you drag it on as a sticker

# website

- sexy splash page for home
- signup for beta
- spreadsheet view into all data next to a simple map

---

triage:

- embed stack of search results > detail fully into url so it retains search in shared link even

---
