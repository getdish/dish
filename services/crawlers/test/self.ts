import anyTest, { TestInterface } from 'ava'

import { db } from '../src/utils'
import { Self } from '../src/self/Self'
import { Restaurant, Scrape } from '@dish/models'

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
  },
}

test.before(() => {
  db.start()
})

test.after(() => {
  db.client.end()
})

test.beforeEach(async (t) => {
  let scrape: Scrape
  await Scrape.deleteAllFuzzyBy('id_from_source', 'test')
  await Restaurant.deleteAllFuzzyBy('name', 'Test')
  const restaurant = new Restaurant(restaurant_fixture)
  await restaurant.insert()
  t.context.restaurant = restaurant
  scrape = new Scrape({ restaurant_id: restaurant.id, ...yelp })
  await scrape.insert()
  scrape = new Scrape({ restaurant_id: restaurant.id, ...ubereats })
  await scrape.insert()
  scrape = new Scrape({ restaurant_id: restaurant.id, ...tripadvisor })
  await scrape.insert()
})

test('Merging', async (t) => {
  const dish = new Self()
  await dish.mergeAll(t.context.restaurant.id)
  const updated = new Restaurant()
  await updated.findOne('id', t.context.restaurant.id)
  t.is(updated.name, 'Test Name Yelp')
  t.is(updated.address, '123 Street, Big City')
  t.deepEqual(
    updated.tags.map((i) => i.taxonomy.name),
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
