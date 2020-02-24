# high level mvp

- Data gathering for bay area / california
- Ratings + admin for seeing ratings/activity
- Infra/API for auth, search, app
- iOS app that covers all functionality for bay
- Splash / marketing website / landing
- Launch blog post

# triage

- put all graphql queries from `apps/lab/src/dishes/index.tsx` and the swift app `api.graphql` into its own area as .graphql files and import/reference them from their respective places.

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

- [ ] fix map positioning
- [ ] fix overall slow speed with current drwaer
- [ ] Search/map should have a loading spinner while searching and dim out previous results
- [x] Filters stack should probably be connected pill button style
- [ ] Animate in the cuisine filters and improve display
- [x] De-focusing search should move drawer back to previous position
- [ ] Map should zoom in/out as you move drawer between top/middle/bottom
- [ ] Bugfix drawer moves up when you scroll down
- [ ] Get search autocomplete interface integrated
- [ ] Fix clicking DishCardView should move drawer down from top and do search
- [ ] Slide in Restaurant cards for map results when drawer at .bottom
  - [ ] Tapping on map grouping should show those selected results at bottom
- [ ] Restore Bottom of map shows restaurant result cards
- [ ] Tap location search selects search text
- [ ] Location search returns locations on search
- [ ] Map icon clustering fixes
  - [ ] Ratings on map? important to figure out
  - [ ] Cuisines colored on map?
- [ ] Tap account/camera moves to left/right + move camera into right
- [ ] Add back in "current location" button somewhere subtle
- [ ] Search has a separate List interface for showing more than just dishes
  - [ ] shows restaurants as well
  - [ ] shows locations as well and tapping changes location bar instead
- [ ] Location search can be smaller (scaleEffect) when not focused a bit
- [ ] Image gallery for restaurant images
- [ ] Camera capturing images
  - [ ] Save to camera roll automatically
  - [ ] Share button that works
  - [ ] Review popover on capture
- [ ] Account pane
  - [ ] Working signup/login
  - [ ] Show account information/menu on logged in
  - [ ] Logout
- [ ] Final splash
- [ ] Welcome popup

Idea for really sexy things that will catch attention (later):

- [ ] Animate from restaurant card at bottom of map up above to the RestaruantView page
- [ ] Camera shows current guessed restaurant name at top and lets you drag it on as a sticker
