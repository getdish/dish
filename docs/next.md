# high level mvp

- Data gathering for bay area / california
- Ratings + admin for seeing ratings/activity
- Infra/API for auth, search, app
- iOS app that covers all functionality for bay
- Splash / marketing website / landing
- Launch blog post

# triage

- put all graphql queries from `apps/lab/src/dishes/index.tsx` and the swift app `api.graphql` into its own area as .graphql files and import/reference them from their respective places.

# website

- just a sexy splash page, search bar

# community

- single screen list, dense, spreadsheet-like, emoji lense voting
- auth/login
- mapkit and map integration (later)
- comments?

# blog

- simple static blog generator or similar
- we should start idea gathering soon for posts
- start sketching out posts

# marketing

- cheap billboards in smaller markets?
- travellers may really want this (cheaper markets?)

# backend

- filters API
  - types: lense, cuisine, simple
    - lense: uses emojis, can be voted on or controlled by us
    - simple: combines with lense: price, open now, delivers, etc
  - { query GetFilters(type: "lense") { name, icon, type, id } }
    - icon is a String / emoji
  - cuisine ("country")
    - one type of filter we'll have is cuisines, on the home screen:
      - grouped by continent! right now i'm doing something like:
        - "North American": "🇺🇸 American", "🇲🇽 Mexican"
        - so perhaps we want something like groupID on filters, and then i can just hardcode which ids map to which continents for simplicity like so:
          - 1001 = Americas
          - 1002 = Africa
          - ...
    - i'll fetch all the filters on startup essentially
- search
  - can pass it filters
  - { query SearchRequest(filters: [{ id: "0", value: true }], geoLocation: {} { restaurants } }
- home
  - shows the top dishes based on your current filters
  - heres an example filter:
    - [Delivers: true, Cuisine: 🇺🇸, Lense: "Chef Picks"]
  - all we fetch from this is top dishes like so:
    - { query GetTopDishesFor(filters: [], geoLocation: {}) { name, id, image } }
- restaurant info
  - geolocation, address, phone
  - dishes
  - rating
- ratings
  - 1, 2, or 3 stars
  - should be returned in all areas for both dish + restaurant
  - restaurant is just generated as an aggregate of dish + yelp and other crawled info we use
  - mutation for rating dish
- lenses
  - this is for the community / admin
  - { mutation VoteRestaurantLense(userId: "", filterId: "", value: true) }

# apps/ios

Following are all "chunks" that will make significant improvements in feel/usability:

- rating needs work, stars seem clunky
- tap image in DishListItem to go straight to gallery
- design sprint on search results page
- peek card at bottom when tapping on individual restaurant
  - pull it up to see full restaurant card
  - lets you swipe between images easily
  - tap brings up gallery view
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

Idea for really sexy things that will catch attention (later):

- Camera shows current guessed restaurant name at top and lets you drag it on as a sticker
