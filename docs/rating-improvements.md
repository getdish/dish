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
