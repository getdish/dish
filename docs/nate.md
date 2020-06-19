- babel plugin to make #{} #[] work with immer

# June

big impact changes:

- emojis for dishes (autocomplete, dishview)
- top comments everywhere
- add comment + rate being really slick
- profiles being nice
- importing instagram and other feed data to have more aliveness
- top dishes <=> map pins + easily moving around cities
  - then easily filter it down to any cuisine (top right input opposite "Uniquely Good")
- resizable mid bar :P
  - would actually be cool if it snapped to isSmall when it got small enough and small also resized!

---

Week 3

in progress

- basic tag admin for managing dish tags
- add an inline section on restuanrantlistitem
- clicking tags:
  - restaurantdetail
  - search result
  - click to see map
- map
  - better occlusion or grouping
  - click item to scroll to row
- restaurant
  - click to call
- restaurantdetail
  - fix general layout
  - add example top_comment
- autocomplete
  - dishes given cuisine
  - go to restaurant if searched
- location search

- dont show autocomplete unless they dont type for ~2s feels less aggressive
- show cuisine dishes carousel when clicking cuisine on search results

- hover "closed until" to show full hours
- user features
- add tip/comment
- Upvote tags
- Better breakdown of rating
- Various user flows (expo auth?)
- Add o tag, upvote/downvote, star
- [ ] hover on left side should show a "banner" on bottom of right

Week 4

- [reserved for productionizing]
- Search vietnamese can show top dishes in search results header
- current location / permissions access (only if they click location?)
- "Tips" - horizontal carousel on restaurant page
- [ ] make a list of articles for luke
- [ ] crawler for "header" images for dishes (Pho) (Instagram?)
- [ ] start crawler to find restaurants instagrams
- splash page for home

---

- have it round the focus of the map to the nearest citycenter if its close - so on san francisco, looks really nice if zoomed out a bit and we can show pins
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
