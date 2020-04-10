import { Restaurant, Scrape, Tag, flushTestData } from '@dish/models'
import anyTest, { ExecutionContext, TestInterface } from 'ava'

import { Self } from '../../src/self/Self'

interface Context {
  restaurant: Restaurant
}

const test = anyTest as TestInterface<Context>

const restaurant_fixture: Partial<Restaurant> = {
  name: 'Test Name Original',
  location: { type: 'Point', coordinates: [0, 0] },
  tag_names: ['rankable'],
  rating: 3,
}

const yelp: Partial<Scrape> = {
  source: 'yelp',
  id_from_source: 'test123',
  data: {
    data_from_map_search: {
      name: 'Test Name Yelp',
      categories: [{ title: 'Mexican' }, { title: 'Pizza' }],
      rating: 4.0,
    },
    data_from_html_embed: {
      mapBoxProps: {
        addressProps: {
          addressLines: ['123 Street', 'Big City'],
        },
      },
    },
    photosp0: [{ src: 'https://yelp.com/image.jpg' }],
    photosp1: [{ src: 'https://yelp.com/image2.jpg' }],
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
          text: 'This restaurant had Test tag existing 1 dishes!',
          language: 'en',
        },
        lightboxMediaItems: [
          {
            url: '',
            type: 'photo',
            user: {},
            caption: 'A photo of Test tag existing 2',
          },
        ],
      },
    ],
  },
}

const ubereats: Partial<Scrape> = {
  source: 'ubereats',
  id_from_source: 'test124',
  data: {
    main: {
      location: { address: '123 Street, Big City, America' },
      title: 'Test Name UberEats',
      ratingBadge: [
        {
          children: [
            {
              text: '4.4 ',
            },
          ],
        },
      ],
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
  data: {
    overview: {
      contact: {
        website:
          'OFdCX2h0dHA6Ly93d3cuaW50ZXJjb250aW5lbnRhbHNhbmZyYW5jaXNjby5jb20vX1o3cQ==',
      },
    },
    photosp0: [{ src: 'https://tripadvisor.com/image.jpg' }],
    photosp1: [{ src: 'https://tripadvisor.com/image2.jpg' }],
    reviewsp0: [
      {
        text: 'Test tag existing 3',
        rating: 5,
        username: 'tauser',
      },
    ],
  },
}

async function reset(t: ExecutionContext<Context>) {
  let scrape: Scrape
  await flushTestData()
  const restaurant = new Restaurant(restaurant_fixture)
  await restaurant.insert()
  t.context.restaurant = restaurant
  scrape = new Scrape({ restaurant_id: restaurant.id, ...yelp })
  await scrape.insert()
  scrape = new Scrape({ restaurant_id: restaurant.id, ...ubereats })
  await scrape.insert()
  scrape = new Scrape({ restaurant_id: restaurant.id, ...tripadvisor })
  await scrape.insert()
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
  const dish = new Self()
  await dish.mergeAll(t.context.restaurant.id)
  const updated = new Restaurant()
  await updated.findOne('id', t.context.restaurant.id)
  t.is(updated.name, 'Test Name Yelp')
  t.is(updated.address, '123 Street, Big City')
  t.deepEqual(
    updated.tags.map((i) => i.tag.name),
    ['Mexican', 'Pizza']
  )
  t.is(updated.dishes[0].name, 'Nice Dish')
  t.is(updated.photos?.[0], 'https://yelp.com/image.jpg')
  t.is(updated.photos?.[1], 'https://yelp.com/image2.jpg')
  t.is(updated.rating, 4.1)
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
  const dish = new Self()
  dish.restaurant = t.context.restaurant
  const r1 = new Restaurant({
    ...restaurant_fixture,
    address: '1',
    rating: 4,
    tag_names: ['rankable'],
  })
  const r2 = new Restaurant({
    ...restaurant_fixture,
    address: '2',
    rating: 5,
    tag_names: ['rankable'],
  })
  await r1.insert()
  await r2.insert()
  await dish.updateTagRankings()
  t.deepEqual(dish.restaurant.tag_rankings, [['rankable', 3]])
})

test('Finding dishes in reviews', async (t) => {
  const dish = new Self()
  const tag = { name: 'Test country' }
  const tag_parent = new Tag(tag)
  await tag_parent.insert()
  const existing_tag1 = new Tag({
    name: 'Test tag existing 1',
    parentId: tag_parent.id,
  })
  const existing_tag2 = new Tag({
    name: 'Test tag existing 2',
    parentId: tag_parent.id,
  })
  const existing_tag3 = new Tag({
    name: 'Test tag existing 3',
    parentId: tag_parent.id,
  })
  await t.context.restaurant.upsertTags([tag])
  await t.context.restaurant.findOne('id', t.context.restaurant.id)
  dish.restaurant = t.context.restaurant
  await dish.getScrapeData()
  await existing_tag1.insert()
  await existing_tag2.insert()
  await existing_tag3.insert()
  await dish.scanReviews()
  const updated = new Restaurant()
  await updated.findOne('id', t.context.restaurant.id)
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
