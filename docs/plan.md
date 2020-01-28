# Dish 6 month rough plan

Ok, so lets really align!

## High level

First things, we should really understand how long of a shot this is. It's overwhelmingly likely we fail, and the absolute most likely reason is:

1. We don't deliver a lean app, early, and iterate many times
2. We don't do content marketing nearly enough or early enough

In other words, more than anything we need to:

1. Get the app working on iOS ASAP and released to app store
2. In parallel, have a strategy + implement content marketing

Everything else here is mostly mapping out the above two things.

---

A note on business:

We need to raise money.

To do that, we need to build a tiny but sexy rocket, then launch it successfully and show we are competent tiny-sexy-rocket-builders-and-launchers.

We *don't* need to:

1. Launch across many platforms
2. Launch in many cities or places
3. Have the best technology (but we do need to leverage new tech to make our lives much easier)
4. Have clean code
5. Solve hard technical problems first

It's a position I haven't been in in a while, but it's a whole lot different than the typical strategy (post raise or bootstrapped) of making money directly.

Why do we need to raise? Because we're aiming at Yelp and really at a lot of companies (Eater, Michelin, Google/AppleMaps), and there's simply no way we get anwhere close to that on our current $200k.

So, we gotta raise. My goal is always to preserve as much equity as possible for the team, and I will always advocate for doing things more lean/bootstrapped than I think many in the valley would, so we'll do that, but we definitely won't be making any significant ad money for years, so a few million dollars will be necessary to get there.

---

Zooming out to our life goals and mission

Since I'm writing a big old document, I'm going to add a section here to keep perspective.

I don't want much. Don't want to run a company, work incredibly hard, achieve fame, etc. All I want is to be able to tackle things at the intersection of interesting work and real world problems. It's banal, sure, but important.

So let's leave this section short. Lets aim to enjoy this venture. We can still be ruthless, frugal, passionate, efficient, etc. But lets make sure the day to day is always focused on:

- Keeping our team small, focused, distraction-free
- Surprising each other by just getting things done well
- Finding great collaborators and bringing in fresh ideas
- Balancing work and life

---

One note on how we can position ourselves in the market that is fun

Ok so, first, understanding some of my influences are good. I'd say you can get a good model of my business sense through a few sources:

1. Thiel's "Zero to One" is a nice, short, great guide
2. Stratechery's writings are super valuable, especially "Aggregation Theory" [0]
3. I don't agree with all of it, but the rest of the good advice would be based on pg's writings and YC's startup school. The choice ones would be "How to raise money" [1], "do things that don't scale" [2], "ramen profitable" [3], "fashionable problems" [4]

### Aggregation Theory

Aggregation theory especially is important for Dish. You can probably get most of it just from this article[5].

We can become the Netflix/Zillow of food, rather than Yelp which is trying to be the first-party source of content. Same goes for food delivery, Yelp owns their own (Eat24/GrubHub) which means they wont ever show their competitors.

This opens up a big opportunity because it means we can aggregate the delivery services *and* we can aggregate the food ratings, and doing so I think is sort of nicely additive: I want rating aggregation, I want delivery aggregation, I also really want great ratings while ordering delivery!

Aggregation also works really well in context of the next section, which I will just start new from here.

[0] https://stratechery.com/concept/aggregation-theory/
[1] http://www.paulgraham.com/fr.html
[2] http://www.paulgraham.com/ds.html
[3] http://www.paulgraham.com/ramenprofitable.html
[4] http://www.paulgraham.com/fp.html
[5] https://stratechery.com/2018/zillow-aggregation-and-integration/

---

Aggregation & The Map

I don't want to get too deep in this document, but this part is interesting.

In the past months here's how my thinking about Dish has evolved:

1. It's simple a way to fix Yelps poor ratings
2. It's a aggregator of delivery/reviews that makes common flows (finding a non-date-spot restaurant, finding good delivery food) 10x easier
3. It's an aggregator like above, but the Map is the most important part

I've realized that todays map applications just aren't specialized at all, and the map experience is the big design problem that if we solve makes a big difference.

Technically, it's not just a "map" but rather a light UI that works together with the map.

There are two things that have never been done really well with maps on our computers:

1. They don't feel very interactively usable
2. They don't let you move, filter, and explore without a lot of typing and shifting between screens

The result is that your research process when using these apps just feels absolutely cumbersome compared to what it could be.

I think this is a results of a few things. First, the Big Guys (Apple, Google) are building very general purpose maps. They do a ton of things. So they basically have a lowest-common-denominator setup.

Second, the specialized guys like Yelp seem to focus on features and sales over experience (that, or they aren't software guys like Michelin, Eater, etc). Plus, Yelp is going broader and broader.

It's *fine* probably to go broader, but that doesn't mean your UX has to falter. For example, imagine Dish expands to do Plumbing reviews as well. I wouldn't say "throw it in the bag" and just start showing 🔧 icons all over the map and adding in all sorts of new filters right into our various filter locations. That would be a huge problem!

Instead, you'd have a button at the very "top" (top of the tree-heirarchy of the apps states, "above" even the searchbar, which could be represented in any number of ways visually), and that button would let you switch between your "mode" of the Map. So you'd have Food mode, and then Plumbing mode.

It may seem like Yelp does this in a sense, but they really don't. Their filters don't really change much at all. The map looks identical no matter the way. The ratings are calculated basically the same. They basically do a bare minimum of specialization.

But being an aggregator means you *should* feel perfectly suited for what you're aggregating. We are aggregating food. We should go very deep there! Ratings, tag breakdowns, the way we pick images, etc etc. Let is all be suited for the purpose.

Later on, when/if we added plumbing, we'd go in and say "whats the relevant attributes for rating/filtering/searching/exploring" and add that top level toggle and switch modes to be around it.

In a sense we are thinking like a search engine rather than a first-party-platform. Aggregation is hugely powerful, not just in UX but in business leverage.

---

Ok, so back to the concrete game plan. We need to Raise

Raising requires a variety of things. We already have a few good ones (a nice looking initial team, really). Here's the other factors we need:

1. Growth
2. A refined pitch thats been battle tested with good VCs
3. Some combination of nicely done brand/product/marketing

One way to think of it is: if we are just developing for most of the month, we are failing. We need to be focuse on growth at every step.

And for VC's - we need to be somewhat sexy. Honestly, sex appeal is just under-valued because it really multiplies with your growth numbers.

I like to think of it in analogy to Tesla:

First: Build a Roadster

Small, easier to build, uses many parts from other things, high end, expensive, sexy, and meant to impress. Extremely good branding and design to prove to the world you're "worth it".

Then, Build a Model S / X

This isn't as relevant to us until we build a Roadster, but notice their second step wasn't to go down market. It was to go broad on the high end. We should do the same.

Then, Build a Model 3 for everyone

You could make the case that each of these is actually for a "round", Roadster for Seed, S/X for A (maybe B too), etc.

---

## Lower level plan

So let's get into the weeds. What is our Roadster?

We've had a ton of ideas and interesting insights. Many of them are really quite tempting to work on. As a great and random example, I really love the idea of being able to "plan a trip" in a sense. No app does this well at all, and when I'm vacationing I always want to find the "local favorites" to eat at first.

But trip planning is a mini-startup of it's own, in a sense. It's an obvious example, and one I think we need to analyze using a framework.

Here's my attempt at systemizing my mental model of evaluating ideas that make it or not:

1. Describe your north star / mission / problem space
2. Choose the concrete, smaller problem in that space you want to fix first and that uniquely helps you solve it
3. Isolate that problem in as many ways as possible that will still generate "hype" but make it far easier to accomplish
4. Relentlessly build/vet that core product, to get a feel for how much room you have and how realistic it is to do
   1. One note: be sure to really push into "risks" in this stage - try and find things that will pop up later and may be hard
5. Using the initial month or two of MVP work towards the most simple but sexy thing you've worked on to decide "what else" makes the cut
6. Be sure to include all the costs/plans for *MARKTEING*

---

Steps 1-4

So steps 1 and 2 are not too hard. Step 3 I think we've done well on in a few dimensions. Let's answer those:

1. We want to make finding great local food work well
2. We'll focus just finding "by dish" first, especially focusing by being great at often-missed cuisines (Asian)
3. How we'll narrow it further:
  - Focus only on SF to start (can expand to other big cities after)
  - Built only an iPhone app (can expand to android after)

Step 4 is just "we need to work another month and really get a feel for where we are, how confident we feel on where we can get to". But, we should still plan this next month for the MVP. Here's what we've roughly talked about doing:

1. Vet out a variety of technology we will use (mostly done)
2. iOS App with one screen for: Map, Search, Explore Dishes (needs a lot)
3. Backend that crawls a wide variety of things for powering apps
4. Vet a lot of things difficulty (crawling, search, map/exploration, filtering, ratings accuracy)

And a list of the things we are planning to crawl. We don't need to have crawled them all in a month, but to have vetted them all and gotten a good feel for how hard it is.

---

Step 5

Now, we're note quite through step 4 yet. But, we have a good idea of many things we want to do in general, so here's me mapping that out.



---

---

Marketing / Growth

Lets not just pay lip service here. I think we need to do three things:

1. Actually have a high quality app (ie: back up your shit talk), so we can:
2. Generate some "news" by taking some shots at the obvious target (Yelp)
3. While also doing some pretty intense and separate content marketing

The way I see this going down is a "campaign" that is themed:

#deleteYelp

I know it's negative. Perhaps we can think of something better, but this will be our measuring stick because I think this campaign could really attract some attention. We also should avoid being too negative - we want to be "poking playfully" at them more than attacking them.

But, then again, Yelp is the company that literally had to buy "yelpsucks.com" to try and twist the facts that they absolutely were extorting people. That they got away with it is just a testament to their own ability to spin, but even in spite of that, the fact remains that Yelp just doesn't work very well.

I know someone who worked there for quite a while in sales early on and he has some really awful things to say about they, including the fact that yes, they did absolutely extort companies.

So, how do we do it?

Here's the general idea I have:

1. We get a domain like deleteyelp.com
2. We put up a long, fun site there explaining all the ways they suck:
   1. We avoid claiming they extorted people, we don't want to get too deep!
   2. They suck at asian restaurants
   3. They over-value service
   4. They make you work! It's like homework to find stuff
   5. They aren't fun or simple, they are like the Facebook
   6. They are bloated as hell
   7. Then we can boast our features
      1. Search across delivery services
      2. Find locals favorites / really authentic cuisine
   8. etc
3. We buy 1-3 billboards in SF:
   1. "#deleteyelp (deleteyelp.com)" (thats it!)
   2. "Wish Yelp didn't suck at asian food?" or "Yelp, but it works for Asian Food"
   3. Chefs and foodies find it on Dish
   4. If you want to ratchet up the controversy - "Yelp, if it didn't only cater to white people" or something like that :P
4. Ali Wong may actually help us out tbh - her rant on asian restaurants is so spot on and she even published an amazing spreadsheet of how to find them, we could prove we actually work for those and I bet we could get in touch somehow if we set it up right!

The idea here is if we can get a little buzz going - and we really need to be careful that we don't hit the hornets nest too hard, for example if we go too negative the media could take the side against ours. But if we do it in a way that seems fun and playful, we could get ourselves a nice round of viral buzz.

Now, the question is - how do we keep that buzz going?

We can't afford to keep marketing like that, but perhaps we could figure out a number of small things we can do to keep ourselves in the news.

Slightly cheaper advertising methods like sponsoring podcasts I think are a really good next step. I think people who are techies actually cross over with foodies a lot too so a few targeted blog ad sponsors, too.

This isn't to say we are "set" on this strategy, and I'd love to find some good twists and angles here - stuff like Ali Wong is a good example where if we can get her on board then we may unlock many cascading sort of opportunities.

I also have a few really key chef friends - one who has worked at a ton of top restaurants in SF and LA, another who owns Fang restaurant in SF and won Chopped twice, and a couple others, and there's perhaps a way we could get them on board too and have them connect us with people.

Finally - Instagram. Instagram is a very obvious huge channel for us because it's where foodies originally went. Maybe they don't now (just post on stories), but I also have a good friend who is really well connected here too and he would do a big favor for us, so we can basically try and think of a way to get some virality here.



