## Upvote/Downvote restaurant

Upvoting/downvoting a restaurant in pages like "/mission" doesn't work and the backend feature doesn't seem to be implemented as talked with @tom, when trying to get the tag in order to be able to review the restaurant with the corresponding vote it, giving it the globalTagId it returns nothing, and as @tom mentioned me, there isn't any way to make a review on a restaurant without a tag, and the score not only is constructed with votes.

![](https://i.imgur.com/AOhVX7F.png)

## Changing map restaurant circle on hover

It seems like the syntax of "stops" ([Function style spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/other/#function)) is not supported inside the ["case" expression](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#case) that is [recommended](https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/) to be used for "on hover" styling, so for now the circle sizes are hardcoded.

I get this error when trying: ![](https://i.imgur.com/f6zWQ22.png)

## Creating / Updating / Removing User restaurant review

The review creation/update right now is a modal, but is actually on a different page (for example: [http://d1staging.com/restaurant/long-bridge-pizza/review](http://d1staging.com/restaurant/long-bridge-pizza/review)), which effectivelly kills direct comunication between the component that made the modal open and the modal itself, ~~and it has a very weird behaviour that it think comes from the router, which is that after the review is made or removed, it doesn't retrigger a re-render on the restaurant page (for example: [http://d1staging.com/restaurant/long-bridge-pizza](http://d1staging.com/restaurant/long-bridge-pizza)) after clicking on the X to go back, therefore, it's not possible to show the just created review or remove the review, and I couldn't find any way to force that re-render (removing the `memo` didn't work).~~

~~Video: [https://imgur.com/gfCWyV9](https://imgur.com/gfCWyV9)~~ Fixed using gqless setCache
