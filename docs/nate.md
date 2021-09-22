- fix:
    - delete tag rating
    - profile edit image/avatar/name
    - add to list insert at bottom not top
    - drag to sort needs some fixes
    - fix scroll to top to pull down transition

- lists need a way to change the slug since we auto-generate it first. it should probably just do it one time, so need to track that in db (or some other way?).

- voting for tagbutton on ipad not working (hoverable only)

- photo upload for reviews

- lists with any location
    - https://developer.apple.com/documentation/mapkitjs/mapkit/search/2974016-autocomplete
- fix mobile web bugs
- slow profile load
- unrate tag
- 0.5 ratings or granular ratings
- make map work with custom point data structure
    - (represent restaurant, OSM, other types of points)
- make inserting tags possible
- make it alive:
    - follow people (+ follow in list page)
    - feed of who you follow
    - discussions within lists
    - auto-lists based on your votes
    - communities
    - more interesting dishes to explore
        - quesabirria
    - this flow:
        - favorite dishes like quesabirria
        - home now shows relevant favorites nearby thats open_now by default
        - home shows quick links to search my favorite dishes/cuisines
- align columns for tag ratings
- Reset password: SyntaxError: The string did not match the expected pattern.
- import osm and integrate into list search

- [m] [0] (restaurantpage) tap: address, phone, website get working
- search autocomplete lists
- beta / invite features
- should we do a mobile web mode that is just flat / no drawer,
    - may actually save time in not too long run?

- go into other verticals

---

- move react-query to react-fetch@latest (see use-asset)
