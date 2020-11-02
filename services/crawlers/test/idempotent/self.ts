import {
  Restaurant,
  RestaurantWithId,
  Tag,
  flushTestData,
  restaurantFindOneWithTags,
  restaurantInsert,
  restaurantTagUpsert,
  restaurantUpdate,
  restaurantUpsertOrphanTags,
  reviewFindAllForRestaurant,
  tagFindOne,
  tagInsert,
  tagUpsert,
} from '@dish/graph'
import { restaurantFindOne } from '@dish/graph'
import anyTest, { ExecutionContext, TestInterface } from 'ava'
import sinon from 'sinon'

import { restaurantSaveCanonical } from '../../src/canonical-restaurant'
import { GoogleGeocoder } from '../../src/GoogleGeocoder'
import { bestPhotosForRestaurant } from '../../src/photo-helpers'
import {
  Scrape,
  deleteAllTestScrapes,
  scrapeInsert,
} from '../../src/scrape-helpers'
import { Self } from '../../src/self/Self'
import { GEM_UIID } from '../../src/self/Tagging'
import { DB, restaurantFindOneWithTagsSQL } from '../../src/utils'
import { breakdown } from '../restaurant_base_breakdown'
import { yelp_hours } from '../yelp_hours'

interface Context {
  restaurant: RestaurantWithId
}

const test = anyTest as TestInterface<Context>

const GOOGLE_GEOCODER_ID = '0xgoogleid123'

const restaurant_fixture: Partial<Restaurant> = {
  name: 'Test Name Original',
  geocoder_id: GOOGLE_GEOCODER_ID,
  location: { type: 'Point', coordinates: [0, 0] },
  rating: 3,
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  sources: {
    yelp: { url: 'https://yelp.com', rating: 3.5 },
    tripadvisor: { url: 'https://tripadvisor.com', rating: 2.5 },
  },
}

const restaurant_fixture_nearly_matches: Partial<Restaurant> = {
  name: 'Test Name Original Nearly Matches',
  location: { type: 'Point', coordinates: [0, 0] },
}

const yelp: Partial<Scrape> = {
  source: 'yelp',
  id_from_source: 'test123',
  data: {
    data_from_map_search: {
      name: 'Test Name Yelp',
      categories: [
        { title: 'Test Mexican' },
        { title: 'Test Pizza' },
        { title: 'Test Spain' },
      ],
      rating: 4.0,
    },
    data_from_html_embed: {
      mapBoxProps: {
        addressProps: {
          addressLines: ['123 Street', 'Big City'],
        },
      },
      bizHoursProps: {
        hoursInfoRows: yelp_hours,
      },
    },
    photosp0: [
      {
        src: 'https://i.imgur.com/92a8cNI.jpg',
        media_data: {
          caption: 'Test tag existing 1',
        },
      },
    ],
    photosp1: [
      {
        src: 'https://i.imgur.com/N6YtgRI.jpeg',
        media_data: {
          caption: 'Test tag existing 2',
        },
      },
    ],
    reviewsp0: [
      {
        id: 'abc123',
        tags: [],
        user: {
          src: '',
        },
        photos: [{ src: '' }],
        rating: 5,
        localizedDate: '5/16/2020',
        userId: 'FsLRE98uOHkBNzO1Ta5hIw',
        comment: {
          text:
            'This restaurant had the worst Test tag existing 1 dishes! Vegetarian',
          language: 'en',
        },
        lightboxMediaItems: [
          {
            url: '',
            type: 'photo',
            user: {},
            caption: 'An amazing photo of Test tag existing 2!',
          },
        ],
      },
    ],
  },
}

const ubereats: Partial<Scrape> = {
  source: 'ubereats',
  id_from_source: 'test124',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    main: {
      location: { address: '123 Street, Big City, America' },
      title: 'Test Name UberEats',
      rating: {
        ratingValue: 4.4,
      },
    },
    dishes: [
      {
        title: 'Nice Dish',
        description: 'Test tag existing 4',
        price: 1,
        imageUrl: 'https://img.com',
      },
    ],
  },
}

const doordash: Partial<Scrape> = {
  source: 'doordash',
  id_from_source: 'test125',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    main: {
      location: { address: '123 Street, Big City, America' },
      title: 'Test Name DoorDash',
      rating: {
        ratingValue: 4.7,
      },
    },
    menus: {
      currentMenu: {
        menuCategories: [
          {
            items: [
              {
                name: 'Nice DD Dish',
                description: 'I am unique to DoorDash',
                price: 2,
                imageUrl: 'https://imgur.com',
              },
            ],
          },
        ],
      },
    },
  },
}

const tripadvisor: Partial<Scrape> = {
  source: 'tripadvisor',
  id_from_source: 'test123xcv',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    overview: {
      contact: {
        website:
          'OFdCX2h0dHA6Ly93d3cuaW50ZXJjb250aW5lbnRhbHNhbmZyYW5jaXNjby5jb20vX1o3cQ==',
      },
      rating: {
        ratingQuestions: [
          {
            name: 'Food',
            rating: 50,
          },
          {
            name: 'Service',
            rating: 45,
          },
          {
            name: 'Value',
            rating: 30,
          },
          {
            name: 'Atmosphere',
            rating: 20,
          },
        ],
      },
    },
    photosp0: [{ src: 'https://tripadvisor.com/image.jpg' }],
    photosp1: [{ src: 'https://tripadvisor.com/image2.jpg' }],
    reviewsp0: [
      {
        text: 'Test tag existing 3 was ok. Vegan',
        rating: 5,
        username: 'tauser',
        date: 'July 23, 2019',
      },
      {
        text: 'No tags in here',
        rating: 5,
        username: 'tauser2',
        date: 'July 23, 2019',
      },
      {
        text: 'Notable Testpho was delicious',
        rating: 5,
        username: 'tauser3',
        date: 'July 23, 2020',
      },
      {
        text: 'Test tag was good. Test tag was amazing. Test tag was delicious',
        rating: 1,
        username: 'tauser4',
        date: 'July 23, 2020',
      },
    ],
  },
}

const google: Partial<Scrape> = {
  source: 'google',
  id_from_source: 'test-google123',
  data: {
    reviews: [
      '4 stars\nNikhil Mascarenhas\nLocal Guide ・4 reviews\n 2 weeks ago\nA Google review....\n Like  Share',
      '1 stars\nName\nLocal Guide ・1 review1\n 1 week ago\nA bad review....\n Like  Share',
    ],
  },
}

async function reset(t: ExecutionContext<Context>) {
  await flushTestData()
  await deleteAllTestScrapes()
  const [restaurant, _] = await restaurantInsert([
    restaurant_fixture,
    restaurant_fixture_nearly_matches,
  ])
  t.context.restaurant = (await restaurantFindOneWithTagsSQL(
    restaurant.id
  )) as RestaurantWithId
  const zero_coord = { lat: 0, lon: 0 }
  const scrapes = [
    { restaurant_id: restaurant.id, location: zero_coord, ...google },
    { restaurant_id: restaurant.id, location: zero_coord, ...yelp },
    { restaurant_id: restaurant.id, location: zero_coord, ...ubereats },
    { restaurant_id: restaurant.id, location: zero_coord, ...doordash },
    { restaurant_id: restaurant.id, location: zero_coord, ...tripadvisor },
  ]
  await Promise.all(scrapes.map((s) => scrapeInsert(s)))
  await tagUpsert([
    {
      name: 'Gem',
      id: GEM_UIID,
    },
    {
      name: 'Unique',
      alternates: ['notable'],
      type: 'lense',
    },
  ])
}

async function addTags(
  restaurant: RestaurantWithId,
  values = [
    'Test tag existing 1',
    'Test tag existing 2',
    'Test tag existing 3',
    'Test tag existing 4',
  ]
) {
  const tag = { name: 'Test country' }
  const [tag_parent] = await tagInsert([tag])
  const tags = await tagInsert([
    {
      name: values[0],
      parentId: tag_parent.id,
    },
    {
      name: values[1],
      parentId: tag_parent.id,
    },
    {
      name: values[2],
      parentId: tag_parent.id,
    },
    {
      name: values[3],
      parentId: tag_parent.id,
    },
  ])
  await restaurantUpsertOrphanTags(restaurant, [tag.name])
  return tags
}

test.beforeEach(async (t) => {
  sinon.restore()
  await reset(t)
})

test('Merging', async (t) => {
  const self = new Self()
  await self.mergeAll(t.context.restaurant.id)
  const updated = await restaurantFindOneWithTags(
    {
      id: t.context.restaurant.id,
    },
    ['menu_items']
  )
  const photos = await bestPhotosForRestaurant(t.context.restaurant.id)
  t.is(photos[0].photo?.origin, 'https://i.imgur.com/N6YtgRI.jpeg')
  t.assert(parseFloat(photos[0].photo?.quality).toFixed(3), '5.374')
  t.is(photos[1].photo?.origin, 'https://i.imgur.com/92a8cNI.jpg')
  t.assert(parseFloat(photos[0].photo?.quality).toFixed(3), '4.575')
  t.is(!!updated, true)
  if (!updated) return
  t.is(updated.name, 'Test Name Yelp')
  t.is(updated.address, '123 Street, Big City')
  t.is(updated.tags.length, 5)
  t.is(updated.tags.map((i) => i.tag.name).includes('Test Mexican'), true)
  t.is(updated.tags.map((i) => i.tag.name).includes('Test Pizza'), true)
  t.is(updated.photos?.[0], 'https://i.imgur.com/N6YtgRI.jpeg')
  t.is(updated.photos?.[1], 'https://i.imgur.com/92a8cNI.jpg')
  t.is(updated.rating, 4.1)
  t.deepEqual(updated.rating_factors as any, {
    food: 5,
    service: 4.5,
    value: 3,
    ambience: 2,
  })
  t.is(updated.website, 'http://www.intercontinentalsanfrancisco.com/')
})

test('Merging dishes', async (t) => {
  const self = new Self()
  await self.mergeAll(t.context.restaurant.id)
  await self.finishTagsEtc()
  const updated = await restaurantFindOneWithTags(
    {
      id: t.context.restaurant.id,
    },
    ['menu_items']
  )
  t.is(!!updated, true)
  if (!updated) return
  t.is(updated.menu_items.length, 2)
  t.assert(updated.menu_items.map((m) => m.name).includes('Nice Dish'))
  t.assert(
    updated.menu_items
      .map((m) => m.description)
      .includes('I am unique to DoorDash')
  )
})

test('Weighted ratings when all sources are present', (t) => {
  const self = new Self()
  const ratings = {
    a: 3,
    b: 4,
    c: 5,
  }
  const weights = {
    a: 0.2,
    b: 0.5,
    c: 1,
  }
  t.is(
    self.restaurant_ratings.weightRatings(ratings, weights),
    4.470588235294118
  )
})

test('Weighted ratings when some sources are missing', (t) => {
  const self = new Self()
  const ratings = {
    a: 3,
    b: 4,
  }
  const weights = {
    a: 0.2,
    b: 0.5,
    c: 1,
  }
  t.is(
    self.restaurant_ratings.weightRatings(ratings, weights),
    3.7142857142857144
  )
})

test('Weighted ratings when there is a weight less than 1', (t) => {
  const self = new Self()
  const ratings = {
    a: 3,
    b: 4,
  }
  const weights = {
    a: 0.2,
    b: 0.5,
  }
  t.is(
    self.restaurant_ratings.weightRatings(ratings, weights),
    3.7142857142857144
  )
})

test('Weighted ratings when there is only 1 weight', (t) => {
  const self = new Self()
  const ratings = {
    b: 4,
  }
  const weights = {
    b: 0.5,
  }
  t.is(self.restaurant_ratings.weightRatings(ratings, weights), 4)
})

test('Weighted ratings when given a null rating', (t) => {
  const self = new Self()
  const ratings = {
    a: null,
    b: 4,
  }
  const weights = {
    a: 0.5,
    b: 0.5,
  }
  t.is(self.restaurant_ratings.weightRatings(ratings, weights), 4)
})

test('Tag rankings', async (t) => {
  const tag_name = 'Test Rankable'
  const self = new Self()
  self.restaurant = t.context.restaurant
  const [tag] = await tagInsert([
    {
      name: tag_name,
    },
  ])
  const [r1, r2] = await restaurantInsert([
    {
      ...restaurant_fixture,
      address: '1',
      geocoder_id: '123',
    },
    {
      ...restaurant_fixture,
      address: '2',
      geocoder_id: 'abc',
    },
  ])
  await restaurantTagUpsert(self.restaurant.id, [
    {
      tag_id: tag.id,
      score: 10,
    },
  ])
  await restaurantTagUpsert(r1.id, [
    {
      tag_id: tag.id,
      score: 20,
    },
  ])
  await restaurantTagUpsert(r2.id, [
    {
      tag_id: tag.id,
      score: 30,
    },
  ])
  self.restaurant = await restaurantFindOneWithTagsSQL(self.restaurant.id)
  await self.preMerge(self.restaurant)
  await self.finishTagsEtc()
  self.restaurant = await restaurantFindOneWithTagsSQL(self.restaurant.id)
  t.is(!!self.restaurant, true)
  if (!self.restaurant) return
  t.is(self.restaurant.tags[0].tag.name, tag_name)
  t.is(self.restaurant.tags[0].rank, 3)
  await restaurantTagUpsert(self.restaurant.id, [
    {
      tag_id: tag.id,
      score: 50,
    },
  ])
  self.restaurant = await restaurantFindOneWithTagsSQL(self.restaurant.id)
  await self.preMerge(self.restaurant)
  await self.finishTagsEtc()
  self.restaurant = await restaurantFindOneWithTagsSQL(self.restaurant.id)
  t.is(self.restaurant.tags[0].rank, 1)
})

test('Finding dishes in the corpus', async (t) => {
  const self = new Self()
  const [
    existing_tag1,
    existing_tag2,
    existing_tag3,
    existing_tag4,
  ] = await addTags(t.context.restaurant)

  t.context.restaurant = (await restaurantFindOneWithTagsSQL(
    t.context.restaurant.id
  ))!
  await self.preMerge(t.context.restaurant)
  await self.getUberDishes()
  await self.scanCorpus()
  await self.finishTagsEtc()
  const updated = await restaurantFindOneWithTagsSQL(t.context.restaurant.id)
  t.assert(updated?.tags.map((i) => i.tag.id).includes(existing_tag1.id))
  t.assert(updated?.tags.map((i) => i.tag.id).includes(existing_tag2.id))
  t.assert(updated?.tags.map((i) => i.tag.id).includes(existing_tag3.id))
  t.assert(updated?.tags.map((i) => i.tag.id).includes(existing_tag4.id))
})

test('Review naive sentiments', async (t) => {
  const self = new Self()
  await addTags(t.context.restaurant)
  const restaurant = (await restaurantFindOneWithTagsSQL(
    t.context.restaurant.id
  )) as RestaurantWithId
  await self.preMerge(restaurant)
  await self.scanCorpus()
  await self.finishTagsEtc()

  // Ensure upserting/constraints work
  let reviews = await reviewFindAllForRestaurant(t.context.restaurant.id)
  t.is(reviews.length, 7)
  await self.scanCorpus()
  await self.finishTagsEtc()

  reviews = await reviewFindAllForRestaurant(t.context.restaurant.id)
  t.is(reviews.length, 7)
  const rv1 = reviews.find((rv) => rv.username == 'yelp-FsLRE98uOHkBNzO1Ta5hIw')
  const rv1s1 = rv1.sentiments.find((s) =>
    s.sentence.includes('Test tag existing 1')
  )
  t.is(rv1s1.naive_sentiment, -3)
  const rv1s2 = rv1.sentiments.find((s) =>
    s.sentence.includes('Test tag existing 2')
  )
  t.is(rv1s2.naive_sentiment, 4)
  const rv2 = reviews.find((rv) => rv.username == 'tripadvisor-tauser')
  const rv2s1 = rv2.sentiments.find((s) =>
    s.sentence.includes('Test tag existing 3')
  )
  t.is(rv2s1.naive_sentiment, 0)
  const rv3 = reviews.find((rv) => rv.username == 'tripadvisor-tauser2')
  t.is(rv3.sentiments.length, 0)
  const rv4 = reviews.find((rv) => rv.username == 'google-Nikhil Mascarenhas')
  t.is(rv4.rating, 4)
})

test('Finding filters and alternates in reviews', async (t) => {
  const tags = await tagInsert([
    {
      name: 'Test Veg',
      type: 'filter',
      alternates: ['veg', 'vegetarian', 'vegan'],
    },
  ])
  const self = new Self()
  await self.preMerge(t.context.restaurant)
  await self.getScrapeData()
  await self.scanCorpus()
  await self.finishTagsEtc()
  const updated = await restaurantFindOneWithTagsSQL(t.context.restaurant.id)
  t.assert(!!updated, 'not found')
  if (!updated) return
  t.assert(updated.tag_names.includes('test-veg'))
})

test('Find photos of dishes', async (t) => {
  const self = new Self()
  const tag = { name: 'Test country' }
  const [tag_parent] = await tagInsert([tag])
  const [existing_tag1, existing_tag2] = await tagInsert([
    {
      name: 'Test tag existing 1',
      parentId: tag_parent.id,
    },
    {
      name: 'Test tag existing 2',
      parentId: tag_parent.id,
    },
  ])
  await restaurantUpsertOrphanTags(t.context.restaurant, [tag.name])
  const restaurant = await restaurantFindOneWithTagsSQL(t.context.restaurant.id)
  t.assert(!!restaurant, 'not found')
  if (!restaurant) return
  t.context.restaurant = restaurant as RestaurantWithId
  await self.preMerge(t.context.restaurant)
  await self.findPhotosForTags()
  await self.finishTagsEtc()
  await restaurantUpdate(self.restaurant)
  const updated = await restaurantFindOneWithTagsSQL(t.context.restaurant.id)
  t.is(updated?.id, t.context.restaurant.id)
  if (!updated) return
  const tag1 =
    updated.tags.find((i) => i.tag.id == existing_tag1.id) || ({} as Tag)
  const tag2 =
    updated.tags.find((i) => i.tag.id == existing_tag2.id) || ({} as Tag)
  t.is(updated.tags.length, 3)
  t.is(tag1.tag.name, existing_tag1.name)
  t.deepEqual(tag1.photos, ['https://i.imgur.com/92a8cNI.jpg'])
  t.is(tag2.tag.name, existing_tag2.name)
  t.deepEqual(tag2.photos, ['https://i.imgur.com/N6YtgRI.jpeg'])
})

test('Identifying country tags', async (t) => {
  const [existing_tag1, existing_tag2] = await tagInsert([
    {
      name: 'Test Mexican',
      type: 'country',
    },
    {
      name: 'Test Spanish',
      type: 'country',
      // @ts-ignore
      alternates: ['Test Spain', 'Test Spainland'],
    },
  ])
  const dish = new Self()
  await dish.mergeAll(t.context.restaurant.id)
  const updated = await restaurantFindOneWithTagsSQL(t.context.restaurant.id)
  t.assert(updated, 'not found')
  if (!updated) return
  t.is(updated.tags.length, 5)
  const tag1 =
    updated.tags.find((i) => i.tag.id == existing_tag1.id) || ({} as Tag)
  const tag2 =
    updated.tags.find((i) => i.tag.id == existing_tag2.id) || ({} as Tag)
  const tag3 =
    updated.tags.find((i) => i.tag.name == 'Test Pizza') || ({} as Tag)
  t.is(tag1.tag.name, 'Test Mexican')
  t.is(tag1.tag.type, 'country')
  t.is(tag2.tag.name, 'Test Spanish')
  t.is(tag2.tag.type, 'country')
  t.assert(tag3.tag.type != 'country')
})

test('Adding opening hours', async (t) => {
  const dish = new Self()
  await dish.preMerge(t.context.restaurant)
  const count = await dish.addHours()
  t.is(count, 7)
  const openers = await DB.one_query_on_main(`
    SELECT restaurant_id
      FROM opening_hours
      WHERE hours @> f_opening_hours_normalised_time('1996-01-01 13:00');
  `)
  t.is(dish.restaurant.id, openers.rows[0].restaurant_id)
  const closers = await DB.one_query_on_main(`
    SELECT restaurant_id
      FROM opening_hours
      WHERE hours @> f_opening_hours_normalised_time('1996-01-01 10:59');
  `)
  t.is(closers.rows.length, 0)
})

test('Inserts a new canonical restaurant', async (t) => {
  sinon.stub(GoogleGeocoder.prototype, 'searchForID').resolves('geocoderid999')
  const name = 'Test Restaurant 999' + Math.random().toString()
  const restaurant_id = await restaurantSaveCanonical(
    'yelp',
    'test999',
    1,
    51,
    name,
    '999 The Street'
  )
  const restaurant = await restaurantFindOne({
    id: restaurant_id,
  })
  t.is(restaurant?.name, name)
  t.is(restaurant?.address, '999 The Street')
})

test('Finds an existing canonical restaurant', async (t) => {
  sinon
    .stub(GoogleGeocoder.prototype, 'searchForID')
    .resolves(GOOGLE_GEOCODER_ID)
  const restaurant_id = await restaurantSaveCanonical(
    'yelp',
    'test123ish',
    1,
    51,
    'Test Name Originalish',
    '123 The Streetish'
  )
  const restaurant = await restaurantFindOne({
    id: restaurant_id,
  })
  t.is(restaurant?.id, restaurant_id)
  t.is(restaurant?.name, 'Test Name Original')
})

test('Finds an existing scrape', async (t) => {
  sinon.stub(GoogleGeocoder.prototype, 'searchForID').resolves('NEVER RETURNED')
  const restaurant_id = await restaurantSaveCanonical(
    'yelp',
    'test123',
    1,
    51,
    'Test Name Originalish',
    '123 The Streetish'
  )
  const restaurant = await restaurantFindOne({
    id: restaurant_id,
  })
  t.is(restaurant?.id, restaurant_id)
  t.is(restaurant?.name, 'Test Name Original')
})

test('Scoring for restaurants', async (t) => {
  const self = new Self()
  await addTags(t.context.restaurant, [
    'Test tag',
    'Testpho',
    'Test 3',
    'Test 4',
  ])
  const restaurant = (await restaurantFindOneWithTagsSQL(
    t.context.restaurant.id
  )) as RestaurantWithId
  await self.preMerge(restaurant)
  await self.mergePhotos()
  await self.scanCorpus()
  await self.postMerge()
  const updated = await restaurantFindOneWithTagsSQL(t.context.restaurant.id)

  const test_pho = await tagFindOne({ name: 'Testpho' })
  breakdown.sources.all.summaries.unique_tags[0].id = test_pho.id
  breakdown.sources.tripadvisor.summaries.unique_tags[0].id = test_pho.id

  t.deepEqual(updated?.upvotes, 8.1)
  t.deepEqual(updated?.downvotes, 2)
  t.deepEqual(updated?.votes_ratio, 4.05)
  t.deepEqual(updated?.source_breakdown, breakdown)
})

test('Scoring for rishes', async (t) => {
  const self = new Self()
  await addTags(t.context.restaurant, [
    'Test tag',
    'Testpho',
    'Test 3',
    'Test 4',
  ])
  const restaurant = (await restaurantFindOneWithTagsSQL(
    t.context.restaurant.id
  )) as RestaurantWithId
  await self.preMerge(restaurant)
  await self.doTags()
  await self.scanCorpus()
  await self.postMerge()

  const updated = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })

  const rish1 = updated?.tags.filter((t) => t.tag.name == 'Test tag')[0]
  const rish2 = updated?.tags.filter((t) => t.tag.name == 'Testpho')[0]
  t.is(rish1.score, 2)
  t.is(rish1.upvotes, 3)
  t.is(rish1.downvotes, 1)
  t.is(rish1.votes_ratio, 3)
  t.is(rish1.review_mentions_count, 5)
  t.is(rish2.review_mentions_count, 1)
  t.deepEqual(rish1.source_breakdown.yelp, {
    score: 0,
    summary: {
      negative: ['This restaurant had the worst Test tag existing 1 dishes!'],
      positive: [' Vegetarian An amazing photo of Test tag existing 2!'],
    },
    upvotes: 1,
    downvotes: 1,
  })
  t.deepEqual(rish1.source_breakdown.google, {
    score: 0,
    summary: { negative: null, positive: null },
    upvotes: 0,
    downvotes: 0,
  })
  t.deepEqual(rish1.source_breakdown.tripadvisor, {
    score: 2,
    summary: {
      negative: null,
      positive: [' Test tag was amazing.', 'Test tag was good.'],
    },
    upvotes: 2,
    downvotes: 0,
  })
  t.is(rish2.score, 1)
  t.deepEqual(rish2.source_breakdown.tripadvisor, {
    score: 1,
    summary: {
      negative: null,
      positive: ['Notable Testpho was delicious'],
    },
    upvotes: 1,
    downvotes: 0,
  })
  t.is(rish1.sentences.length, 5)
  t.assert(
    rish1.sentences.find(
      (s) =>
        s.sentence ==
        'This restaurant had the worst Test tag existing 1 dishes!'
    )
  )
  t.assert(rish1.sentences.find((s) => s.sentence == 'Test tag was good.'))
})
