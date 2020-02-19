# high level mvp

- Data gathering for bay area / california
- Ratings + admin for seeing ratings/activity
- Infra/API for auth, search, app
- iOS app that covers all functionality for bay
- Splash / marketing website / landing
- Launch blog post

# backend

- filters API, two types:
  - lense, simple
    - lense: uses emojis, can be voted on or controlled by us
    - simple: combines with lense: price, open now, delivers, etc
  - { query GetFilters(type: "lense") { name, type, id } }
- search
  - can pass it filters
  - { query SearchRequest(filters: [{ id: "0", value: true }], geoLocation: {} { restaurants } }
- dishes
  - also take filters
    - so we can see "top dishes for these filters"
  - { query GetTopDishesForMap(filters: [], geoLocation: {}) { name, id } }
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

- Explore
  - Make category click work "Seafood"
  - Cache for categories results
  - Make going between panes have simple animation
- Search UI
  - Tapping searchbar moves it all the way to top
  - Search API needs to return all types:
    - Restaurant, Dish, Locations
- Location Search UI
  - Tapping location tab bing up Search UI, focused on location
  - "Current Location" + may want recent locations etc
- Restaurant UI
  - Tapping on restaurant brings up drawer
  - Menu display
  - Rating calculation breakdown
- Restaurant Gallery UI
  - From restaurant need to go into a gallery of images
- Filters bar working w/search API
  - "Open" filter should have optional time picker
- Result card improvements (many)
  - Ratings, tags, call, info, quick view images
- Searchbar fix tags
- Map view:
  - Google, mapbox, apple?
  - Pins showing from our search results
  - Re-search on move + option (default on)
- Review/Camera UI
  - Needs endpoints for uploading images
  - Filters
  - Stickers
  - Current restaurant name
  - Rating selection
- Splash
- Welcome
- Login/Auth
