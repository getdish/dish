## August

- list of cities to crawl
- revisit ssr and prod
- Mapbox
- Mobile site
- Voting, tagging, commenting improvements
- React Native app
- Blog posts
- A bit of user profile page polish
  - show favorites on the map!
- Admin icons, ratings
- Dish rating breakdown

---

small:

- Fix <Dish /> type remove TopCuisineItem weird type and change to tag, but maybe split into to <DishFromTag />, <DishFromRestaurant /> or similar
- autocomplete = higher ranking higher

## July

- Restaurant page
  - each dish should have a summary
  - better rating breakdown! on actual page
- user input features and refine
- Various user flows (expo auth?)

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

---

- spreadsheet view into all data next to a simple map
- actually a full review card could show at bottom of map when restaurant opened all the way
- RestaurantDetail social media links

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

---

triage:

- embed stack of search results > detail fully into url so it retains search in shared link even

---

- babel plugin to make #{} #[] work with immer
