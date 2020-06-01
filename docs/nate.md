# June

Week 1

- static style extract v1
- gallery view / click dish to gallery
- hoverable popover
- Searchbar needs many fixes for tags
- Autocomplete needs many fixes
- Map needs a lot of regression/fixes

Week 2

- gallery and restaurant detail page need a lot of love
- improve search results speed and lazy loading
- RestaurantListItem - needs click to call, click to see map

* add tip/comment
* Make sure toasts are working for actions

* Upvote tags
* Better breakdown of rating
* Some sort of way to highlight comments or at least summaries of features (bert?) on restaurant detail or else it feels too empty
* Menu/inside/outside
* Various user flows (expo auth?)

- Add o tag, upvote/downvote, star
- [ ] hover on left side should show a "banner" on bottom of right

---

- [ ] crawler for "header" images for dishes (Pho) (Instagram?)
- [ ] start crawler to find restaurants instagrams

  - [ ] crawler for instagrams themselves

- map click item scroll to item / view detail
- current location / permissions access (only if they click location?)
- RestaurantListItem click address, menu, phone
- if showing a cuisine search "Vietnamese"

  - show the dishes!
    - in autocomplete
    - and above the search results!

- "Tips" - horizontal carousel on restaurant page

  - lets you enter a tip easily from there
  - actually a full review card could show at bottom of map when restaurant opened all the way

- Autocomplete - go straight to restaurant if restaurant
- peek restaurant (show on map bottom or in popover?)
- gallery first from listitem

  - then from restaurantdetail
  - rightsidegallery?
    - listitem - hover image and it replaces map side with image gallery/grid
    - detail - bottom section shows top dishes in design + row of images below, BUT
      - the entire section is just one hoverable area
        - hover shows the same right-side image gallery
      - dealbreaker
        - map has to move to pip then i think until you close or else its too awkward

- RestaurantDetail social media links

- search

  - hover "closed until" to show full hours
  - delivery button/hover to see services/names
  - horizontal scroll (load more on scroll, show one to start)
  - click image to go right into gallery
  - working tag buttons that link to show that category

---

## Thoughts behind

My prior for starting dish is basically that "ratings accuracy" for actual food for Yelp/Google is at about 60%. I think infatuated may be closer to 70%, michelin close to 95% (but for only a couple thousand), the delivery services 30%.

We want to bring that up to 90%+.

In other industries you see ratings aggregators that consistently are very accurate. The best example is Rottentomatoes, so much so that theres a massive quora thread debating if its declines in recent years (https://www.quora.com/Has-Rotten-Tomatoes-become-less-reliable-overinflated-in-recent-years-2015%E2%80%9317-Has-Rotten-Tomatoes-become-too-agenda-driven-to-be-reliable).

- [https://develop.consumerium.org/wiki/Lists_of_review_aggregators_and_review_sites]

Why I like rottentomatoes: mostly, they consistently match my expectations, and most importantly, their 90%+ movies are super high chance of being enjoyable (this is part because i filter as well on top of what they show: user score vs critic score has a lot if information you can use to discern pop-vs-serious etc and decide what you want, so its part good info display, part aggregation of critics, part user)

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
