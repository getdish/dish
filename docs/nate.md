# June

side goal: write 15m in the morning every day

Week 2

- show cuisine dishes carousel when clicking cuisine ons earch results
- gallery view (click to see full)
- searchbar fixes for:
  - delete tag
  - keyboard
- clicking tags:
  - restaurantdetail
  - search result
- map
  - better occlusion or grouping
  - click item to scroll to row
- restaurant
  - click to call
  - click to see map
- restaurantdetail
  - fix general layout
  - add example top_comment
- autocomplete
  - dishes given cuisine
  - go to restaurant if searched
  - fix any nav issues
- location search
  - working search
  - working initial items
- dont show autocomplete unless they dont type for ~2s feels less aggressive

Week 3

- hover "closed until" to show full hours
- delivery button/hover to see services/names
- horizontal scroll (load more on scroll, show one to start)
- user features
- add tip/comment
- Make sure toasts are working for actions
- Upvote tags
- Better breakdown of rating
- Some sort of way to highlight comments or at least summaries of features (bert?) on restaurant detail or else it feels too empty
- Menu/inside/outside
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
