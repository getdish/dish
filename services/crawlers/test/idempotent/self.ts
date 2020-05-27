import {
  Restaurant,
  RestaurantWithId,
  Scrape,
  Tag,
  flushTestData,
  restaurantFindOne,
  restaurantInsert,
  restaurantUpdate,
  restaurantUpsertOrphanTags,
  scrapeInsert,
  tagInsert,
} from '@dish/graph'
import { restaurantFindOneWithTags } from '@dish/graph/src'
import anyTest, { ExecutionContext, TestInterface } from 'ava'
import { rest } from 'lodash'

import { Self } from '../../src/self/Self'

interface Context {
  restaurant: RestaurantWithId
}

const test = anyTest as TestInterface<Context>

const restaurant_fixture: Partial<Restaurant> = {
  name: 'Test Name Original',
  location: { type: 'Point', coordinates: [0, 0] },
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  tag_names: ['rankable'],
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
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
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
    },
    photosp0: [
      {
        src: 'https://yelp.com/image.jpg',
        media_data: {
          caption: 'Test tag existing 1',
        },
      },
    ],
    photosp1: [
      {
        src: 'https://yelp.com/image2.jpg',
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
        comment: {
          text: 'This restaurant had terrible Test tag existing 1 dishes!',
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
        description: 'Tastes good :p',
        price: 1,
        image: 'https://img.com',
      },
    ],
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
        text: 'Test tag existing 3 was ok',
        rating: 5,
        username: 'tauser',
      },
    ],
  },
}

async function reset(t: ExecutionContext<Context>) {
  await flushTestData()
  const [restaurant, r2] = await restaurantInsert([
    restaurant_fixture,
    restaurant_fixture_nearly_matches,
  ])
  t.context.restaurant = restaurant
  await scrapeInsert([
    { restaurant_id: restaurant.id, ...yelp },
    { restaurant_id: restaurant.id, ...ubereats },
    { restaurant_id: restaurant.id, ...tripadvisor },
  ])
}

test.beforeEach(async (t) => {
  try {
    await reset(t)
  } catch (e) {
    // Hopefully this was only ever being caused by the tests being run in parallel
    if (e.message.includes('violates foreign key constraint')) {
      console.log('Retrying beforeEach due to scrape foreign key violation')
      await reset(t)
    }
  }
})

test('Merging', async (t) => {
  const self = new Self()
  await self.mergeAll(t.context.restaurant.id)
  const updated = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.is(!!updated, true)
  if (!updated) return
  t.is(updated.name, 'Test Name Yelp')
  t.is(updated.address, '123 Street, Big City')
  t.is(updated.tags.length, 3)
  t.is(updated.tags.map((i) => i.tag.name).includes('Test Mexican'), true)
  t.is(updated.tags.map((i) => i.tag.name).includes('Test Pizza'), true)
  t.is(updated.dishes[0].name, 'Nice Dish')
  t.is(updated.photos?.[0], 'https://yelp.com/image.jpg')
  t.is(updated.photos?.[1], 'https://yelp.com/image2.jpg')
  t.is(updated.rating, 4.1)
  t.deepEqual(updated.rating_factors as any, {
    food: 5,
    service: 4.5,
    value: 3,
    ambience: 2,
  })
  t.is(updated.website, 'http://www.intercontinentalsanfrancisco.com/')
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
  t.is(self.weightRatings(ratings, weights), 4.470588235294118)
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
  t.is(self.weightRatings(ratings, weights), 3.7142857142857144)
})

test('Tag rankings', async (t) => {
  const tag_name = 'Test Rankable'
  const self = new Self()
  self.restaurant = t.context.restaurant
  const [r1, r2] = await restaurantInsert([
    {
      ...restaurant_fixture,
      address: '1',
      rating: 4,
    },
    {
      ...restaurant_fixture,
      address: '2',
      rating: 5,
    },
  ])
  await restaurantUpsertOrphanTags(self.restaurant, [tag_name])
  await restaurantUpsertOrphanTags(r1, [tag_name])
  await restaurantUpsertOrphanTags(r2, [tag_name])
  await self.updateTagRankings()
  const restaurant = await restaurantFindOneWithTags(self.restaurant)
  t.is(!!restaurant, true)
  if (!restaurant) return
  t.is(restaurant.tags[0].tag.name, tag_name)
  t.is(restaurant.tags[0].rank, 3)
})

test('Finding dishes in reviews', async (t) => {
  const self = new Self()
  const tag = { name: 'Test country' }

  const [tag_parent] = await tagInsert([tag])
  const [existing_tag1, existing_tag2, existing_tag3] = await tagInsert([
    {
      name: 'Test tag existing 1',
      parentId: tag_parent.id,
    },
    {
      name: 'Test tag existing 2',
      parentId: tag_parent.id,
    },
    {
      name: 'Test tag existing 3',
      parentId: tag_parent.id,
    },
  ])

  await restaurantUpsertOrphanTags(t.context.restaurant, [tag.name])
  t.context.restaurant = (await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  }))!
  self.restaurant = t.context.restaurant
  await self.getScrapeData()
  await self.scanReviews()
  const updated = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.assert(!!updated, 'not found')
  if (!updated) return
  t.assert(
    updated.tags.map((i) => i.tag.id),
    existing_tag1.id
  )
  t.assert(
    updated.tags.map((i) => i.tag.id),
    existing_tag2.id
  )
  t.assert(
    updated.tags.map((i) => i.tag.id),
    existing_tag3.id
  )
})

test('Dish sentiment analysis from reviews', async (t) => {
  const self = new Self()
  const tag = { name: 'Test country' }
  const [tag_parent] = await tagInsert([tag])
  const [existing_tag1, existing_tag2, existing_tag3] = await tagInsert([
    {
      name: 'Test tag existing 1',
      parentId: tag_parent.id,
    },
    {
      name: 'Test tag existing 2',
      parentId: tag_parent.id,
    },
    {
      name: 'Test tag existing 3',
      parentId: tag_parent.id,
    },
  ])
  await restaurantUpsertOrphanTags(t.context.restaurant, [tag.name])
  const restaurant = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.is(!!restaurant, true)
  if (!restaurant) return
  t.context.restaurant = restaurant as RestaurantWithId
  self.restaurant = t.context.restaurant
  await self.getScrapeData()
  await self.scanReviews()
  const updated = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.assert(!!updated, 'not found')
  if (!updated) return
  const tag1 =
    updated.tags.find((i) => i.tag.id == existing_tag1.id) || ({} as Tag)
  const tag2 =
    updated.tags.find((i) => i.tag.id == existing_tag2.id) || ({} as Tag)
  const tag3 =
    updated.tags.find((i) => i.tag.id == existing_tag3.id) || ({} as Tag)
  t.is(tag1.rating, -3)
  t.is(tag2.rating, 4)
  t.is(tag3.rating, 0)
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
  const restaurant = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.assert(!!restaurant, 'not found')
  if (!restaurant) return
  t.context.restaurant = restaurant as RestaurantWithId
  self.restaurant = t.context.restaurant
  await self.getScrapeData()
  await self.findPhotosForTags()
  await restaurantUpdate(self.restaurant)
  const updated = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.is(updated?.id, t.context.restaurant.id)
  if (!updated) return
  const tag1 =
    updated.tags.find((i) => i.tag.id == existing_tag1.id) || ({} as Tag)
  const tag2 =
    updated.tags.find((i) => i.tag.id == existing_tag2.id) || ({} as Tag)
  t.is(updated.tags.length, 3)
  t.is(tag1.tag.name, existing_tag1.name)
  t.deepEqual(tag1.photos, ['https://yelp.com/image.jpg'])
  t.is(tag2.tag.name, existing_tag2.name)
  t.deepEqual(tag2.photos, ['https://yelp.com/image2.jpg'])
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
  const updated = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  t.assert(updated, 'not found')
  if (!updated) return
  t.is(updated.tags.length, 3)
  const tag1 =
    updated.tags.find((i) => i.tag.id == existing_tag1.id) || ({} as Tag)
  const tag2 =
    updated.tags.find((i) => i.tag.id == existing_tag2.id) || ({} as Tag)
  const tag3 =
    updated.tags.find((i) => i.tag.name == 'Test Pizza') || ({} as Tag)
  t.is(tag1.tag.name, 'Test Mexican')
  t.is(tag2.tag.name, 'Test Spanish')
  t.is(tag2.tag.type, 'country')
  t.assert(tag3.tag.type != 'country')
})
