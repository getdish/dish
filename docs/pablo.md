## Upvote/Downvote restaurant

Upvoting/downvoting a restaurant in pages like "/mission" doesn't work and the backend feature doesn't seem to be implemented as talked with @tom, when trying to get the tag in order to be able to review the restaurant with the corresponding vote it, giving it the globalTagId it returns nothing, and as @tom mentioned me, there isn't any way to make a review on a restaurant without a tag, and the score not only is constructed with votes.

![](https://i.imgur.com/AOhVX7F.png)

## Changing map restaurant circle on hover

It seems like the syntax of "stops" ([Function style spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/other/#function)) is not supported inside the ["case" expression](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#case) that is [recommended](https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/) to be used for "on hover" styling, so for now the circle sizes are hardcoded.

I get this error when trying: ![](https://i.imgur.com/f6zWQ22.png)
