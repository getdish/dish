# Looping back around to the plan

1. I like it overall, slimmed it down
2. We haven't shipped yet, but you can't really gain any traction doing food search without solving it pretty well, its a consumer product it has to shine, and really we have done amazing work.

Want to write some notes on where I see long-term.

Ultimately, I'd like it to be a "guide to whats unique in this area", done collaboratively. And with a big focus on being quirky and fun, but not cheesy or sloppy. Thats why I like Pokedex, Nintendo tends to really nail the perfect balance between polish and character/fun. We want to do that for an app.

Ultimately, the pitch to VC's goes beyond food. It's a "world guide", a modern Atlas. Poke-Dex is Pokemon (Pocket Monsters) InDex. Atlas was a Greek Giant (pre-god), he was defeated by gods and had to hold the sky on his shoulders.

So perhaps we could find some names in there.

But basically - if I took Dish and looked at San Francisco, what I'd see is a map of unique locations with icons that I can explore easily. But on the left (content side) I would see almost a Wikipedia type page, something that introduced me to the city, gave me all the major categories. Of course, like Yelp we'd have many commercial things, but also we'd have experiences, classes, outdoor activities and nature trails, pop-ups, and events. Basically, anything you wanted to know about the city is there.

But also - importantly - it would feel a bit more like Reddit. In that, this content would be sorted somewhat by recent things, would have discussions on everything that is happening, and would generally tend to curate really interesting things that you wouldn't normally find. Local breweries and their events, craft kombucha, chefs that live their and their restaurants and background. I could even see lenses that give you really interesting looks into the world - historical, for example - see Turkey and all the great historical events where they happened, through time. Data lenses like lenses to see data on how areas have changed politically, demographically, etc. In a sense, its Wikipedia with a map, which hasn't really been done before, but it just happens to be grander in vision in that it goes all the way up to current events and supports intense specific breakdowns for every vertical within (like food).

Also - it would serve as a really nice guide. If you wanted to plan a trip, you could do it all start to finish. Give it a time amount you're there, some preferences, and have it actually give you really interesting things to do. Not just some generic stuff for the "normie", but the sort of insider fun things you'd expect a friend who lived there to give you. In fact, you could see Dish as in the long run encouraging more of these types of unique experiences to happen. Very millenial.

If anything, Dishs model would move towards taking a cut of events that list there in some way and avoiding advertising. I wouldn't want a membership for any sort of content limiting, perhaps we could charge for premium features, and charge for maintaing your listing more proactively.

---

# Dish notes

TL;DR

1. Build a nice iOS app for exploring good cuisine by dish in SF-first
2. Build a content/web site and content market Listicles/data-driven-articles
3. Set up a marketing campaign #cancelyelp, make it funny
4. Do it all lean af, focusing on getting things in peoples hands first

---

The absolute most likely reason we fail is:

1. We don't deliver a lean app, early, and iterate many times
2. We don't do content marketing nearly enough or early enough

In other words, more than anything we need to:

1. Get the app working on iOS ASAP and released to app store
2. In parallel, have a strategy + implement content marketing

---

### Aggregation Theory

Aggregation theory which basically means "Be the early Netflix or Zillow of food" (ie, aggregate lots of data sources in one place: ratings + delivery), I think, is important for Dish.

I recommend this article [5].

Yelp is a first-party source of ratings + delivery (Eat24/GrubHub), they _wont ever be an aggregator_.

It means we can aggregate _both_ delivery services and food ratings, and doing so seems additive: "as a user I want rating aggregation, I want delivery aggregation, and it would be especially useful in the same place so my delivery orders are way easier and I'm not hopping around apps!"

I'm not positive aggregation theory is our key insight or 100% necessary, but it's a nice lense to look through.

[0] https://stratechery.com/concept/aggregation-theory/
[1] http://www.paulgraham.com/fr.html
[2] http://www.paulgraham.com/ds.html
[3] http://www.paulgraham.com/ramenprofitable.html
[4] http://www.paulgraham.com/fp.html
[5] https://stratechery.com/2018/zillow-aggregation-and-integration/

---

10x better

One really nice startupy idea common in SV is that you should only do things that are 10x better. How can we be 10x better than Yelp? I think there are many ways, we should choose just a couple.

I like how slava put it in terms of "Gamechangers and Showstoppers" [insert reference]. Basically, when evaluating what to do, always ask:

1. Gamechanger - does this thing _significantly_ improve chances of success?
2. Showstopper - does this thing _significantly_ detract from chance of success?

I think we can do the following 10x Better:

1. Finding best food by dish
2. Finding best Asian (non-service-focused) restaurants (bad in yelp/google)
3. Exploring whats good on a map (see next section)
4. Searching across all delivery services (nonexistant now)

---

The Map

Exploration is really underserved. Look at Yelp/Google: you search "food" and it just throws a few pins at your in your area.

Here's a 10x:

1. Rich icons for types of dish (emoji style)
2. Colors for types of cuisine (Red = chinese, Green = italian, etc)
3. Updates as you move it by default showing the top restaurants for wherever you point
4. Shows different data depending on zoom level to give you an idea of regions/groups as the data gets dense
5. Shows the three levels of ratings very differently (dots for ok, diamonds for good, pins for great)
6. Shows name / price / tags inline on the map if space is there

---

Some tips as we develop

If we are just developing for most of the month, we are failing. We need to be focus on growth at every step. And for VC's - we need to be somewhat sexy. Honestly, sex appeal is just under-valued because it really multiplies with your growth numbers. But it's _only_ useful if combined with growth.

I like to think of it in analogy to Tesla:

First: Build a Roadster

Narrow in scope, smaller, off the shelf parts, narrow focused (high end), more expensive (we can appeal much more to foodies / early adopters in tech), sexy, and meant to impress. Great marketing + brand + product to prove to the world you're "worth it".

Then, Build a Model S / X

This isn't as relevant to us until we build a Roadster, but notice their second step wasn't to go down market. It was to go broad on the high end. We should do the same.

Then, Build a Model 3 for everyone

You could make the case that each of these is actually for a "round", Roadster for Seed, S/X for A (maybe B too), etc.

---

Eventually going broad

So we'll be laser focused on dishes. But just a note on how we _could_ expand.

Steps:

1. Build a great local-dish finding app in a limited market
2. Make it work better around the world + better outside dishes (cuisine, etc)
3. Local search/guides! But don't "genercize/featurize"

I do think that we could fill another gap I see generally which is that no map app does a great job of being a "become an expert in this area" or "im travleing to an area and I want to really understand it" well at all. Exploration is really poor.

As an example of a good way to expand without "genericizing" is say we're adding coffee shops:

Tap 🍽 icon at the top, change it to ☕️, and see all coffee shops. But, now the map can show differnt types of inline tags (open late, has chargers, comfy seating, good lighting). Same goes for the filters. Maybe pictures aren't so important _of the coffee_ but really important _of the cafe_. Etc.

I think this state of mind should lead us to a much better place than Google Maps or Yelp.

In the very very long term, this nicely leads us to becoming the best local search / trip planning app essentially. You could just go to your trip location (Hawaii) and _browse_ super easily. Then star stuff, maybe it goes into a bucket by that area, and have a little "auto trip planner". Boom, you have your vacation planned! It's a nice "vision" for the company.

Thinking in that lens: Who knows, someday we could even have great info on history of the place, with fun historical maps, etc.

---

## Lower level plan

So, in bullets:

1. Make a great local food finding app
   1. It fixes finding good Asian food
   2. It fixes not showing places w/good service but just "ok" food
   3. It fixes finding hole in the walls / single dish places
   4. It potentially lets you search across delivery services
   5. It potentially lets you explore map nicely without needing to search
   6. We'll focus just finding "by dish" first, especially focusing by being great at often-missed cuisines (Asian)
   7. How we'll narrow it further:
   - Focus only on SF to start (can expand to other big cities after)
   - Built only an iPhone app (can expand to android after)
2. For growth/marketing:
   1. Save about \$30-40k for ad spend once ready
      1. cancelyelp.com may be our best play there + billboards + some social
   2. Build a website that we can publish content on
      1. Generated or contractor-written highly SEO optimized Listicles
      2. Data-driven insight posts on our beautiful map if we can
      3. ? Think of other good "content verticals"

---

## Marketing / Growth

Lets not just pay lip service here. I think we need to do three things:

1. Actually have a high quality app (ie: back up your shit talk), so we can:
2. Generate some "news" by taking some shots at the obvious target (Yelp)
3. While also doing some pretty intense and separate content marketing

The way I see this going down is a "campaign" that is themed:

#cancelyelp

I know it's "negative", but lets try and keep it cheeky/comedic/smart to avoid blowback. Think - Apples 1984 campaign.

Perhaps we can think of something better, but this will be our measuring stick because I think this campaign could really attract some attention.

Again, Yelp is the company that literally had to buy "yelpsucks.com" to try and twist the facts that they absolutely were extorting people. That they got away with it is just a testament to their own ability to spin, but even in spite of that, the fact remains that Yelp just doesn't work very well for a lot of things - its everyones favorite app to bitch about.

(I know someone who worked there for quite a while in sales early on and he has some really awful things to say about they, including the fact that yes, they did absolutely pressure companies to pay for better reviews).

So, how do we do it?

Here's the general idea I have:

1. We get a domain like deleteyelp.com (got cancelyelp.com)
2. We put up a long, fun site there explaining all the ways they suck:
   1. We avoid claiming they extorted people, avoid lawsuit!
   2. They suck at asian restaurants / hole in the walls
   3. They way over-value service
   4. They make you work! It's like homework to find stuff
   5. They aren't fun or simple, they are like the Facebook
   6. Then we can boast our features
      1. Search across delivery services
      2. Find locals favorites / really authentic cuisine
3. We buy 1-3 billboards in SF:
   1. "#cancelyelp (cancelyelp.com)"
   2. something like "Yelp, but it doesnt suck @ asian food (and its actually fun to use)"
   3. Chefs + foodies are on Dish

Random note but perhaps someone like Ali Wong may actually help us out - her rant on asian restaurants is spot on and she even published an amazing spreadsheet of how to "tell" good asian food restaruants. In fact, we could even integrate some of those things somehow into Dish and advertise that:

"Everyone knows good Pho doesn't come from a place called Pho-get-about-it, why does Yelp supress authentic asian food?"

If we could prove we actually work for Ali Wongs list of restaurants I bet we could maybe even get her to endorse us somehow!

Plus, it totally plays well in that she loves "burning" things, and we can burn Yelp (playfully) on being shitty at that.

The idea here is if we can get a little buzz going - in a platful way. Virality!

### The next question is - how do we keep that buzz going?

We can't afford to keep marketing like that, but perhaps we could figure out a number of small things we can do to keep ourselves in the news.

Slightly cheaper advertising methods like sponsoring podcasts I think are a really good next step. I think people who are techies actually cross over with foodies a lot too so a few targeted blog ad sponsors, too.

This isn't to say we are "set" on this strategy, and I'd love to find some good twists and angles here - stuff like Ali Wong is a good example where if we can get her on board then we may unlock many cascading sort of opportunities.

I also have a few really key chef friends - one who has worked at a ton of top restaurants in SF and LA, another who owns Fang restaurant in SF and won Chopped twice, and a couple others, and there's perhaps a way we could get them on board too and have them connect us with people.

Finally - Instagram. Instagram is a very obvious huge channel for us because it's where foodies originally went. Maybe they don't now (just post on stories), but I also have a good friend who is really well connected here too and he would do a big favor for us, so we can basically try and think of a way to get some virality here.

---

## Step by Step

iOS

- [ ] Home
  - [ ] interaction and animation fixes
  - [ ] filterbar work on display/function
  - [ ]
- [ ]

Backend

Web

Marketing
