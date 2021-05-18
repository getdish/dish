import { Restaurant } from '@dish/graph'

import { Scrape } from '../src/scrape-helpers'
import { YelpScrape } from '../src/yelp/Yelp'

const GOOGLE_GEOCODER_ID = '0xgoogleid123'

export const restaurant_fixture: Partial<Restaurant> = {
  name: 'Test Name Original',
  geocoder_id: GOOGLE_GEOCODER_ID,
  location: { type: 'Point', coordinates: [0, 0] },
  rating: 3,
  sources: {
    yelp: { url: 'https://yelp.com', rating: 3.5 },
    tripadvisor: { url: 'https://tripadvisor.com', rating: 2.5 },
    google: { url: 'https://google.com', rating: 4.5 },
  },
}

export const restaurant_fixture_nearly_matches: Partial<Restaurant> = {
  name: 'Test Name Original Nearly Matches',
  location: { type: 'Point', coordinates: [0, 0] },
}

export const yelp: Partial<YelpScrape> = {
  source: 'yelp',
  id_from_source: 'test123',
  data: {
    data_from_search_list_item: {
      name: 'Test Name Yelp',
      formattedAddress: '123 Street, Big City',
      businessUrl: 'http://www.intercontinentalsanfrancisco.com/',
      categories: [{ title: 'Test Mexican' }, { title: 'Test Pizza' }, { title: 'Test Spain' }],
      post: {
        review_link: '',
        rating: 4.0,
      },
      priceRange: '$$',
      street: '123 Street',
    },
    dynamic: require('../src/fixtures/yelp-dynamic-fixture').default,
    json: require('../src/fixtures/yelp-json-fixture').default,
    photos: {
      'dishpage-0': [
        {
          url: 'https://i.imgur.com/92a8cNI.jpg',
          caption: 'Test tag existing 1',
        },
      ],
      'dishpage-1': [
        {
          url: 'https://i.imgur.com/N6YtgRI.jpeg',
          caption: 'Test tag existing 2',
        },
      ],
    },
    reviews: {
      'dishpage-0': [
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
            text: 'This restaurant had the worst Test tag existing 1 dishes! Vegetarian',
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
  },
}

export const ubereats: Partial<Scrape> = {
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

export const doordash: Partial<Scrape> = {
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

export const tripadvisor: Partial<Scrape> = {
  source: 'tripadvisor',
  id_from_source: 'test123xcv',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    overview: {
      contact: {
        website: 'OFdCX2h0dHA6Ly93d3cuaW50ZXJjb250aW5lbnRhbHNhbmZyYW5jaXNjby5jb20vX1o3cQ==',
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
    photos: ['https://i.imgur.com/udwFNWI.jpeg'],
    photos_with_captions: [{ url: 'https://i.imgur.com/udwFNWI.jpeg', caption: 'Test tag' }],
    reviews: {
      'dishpage-0': [
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
  },
}

export const google: Partial<Scrape> = {
  source: 'google',
  id_from_source: 'test-google123',
  data: {
    reviews: [
      '4 stars\nNikhil Mascarenhas\nLocal Guide ・4 reviews\n 2 weeks ago\nA Google review....\n Like  Share',
      '1 stars\nName\nLocal Guide ・1 review1\n 1 week ago\nA bad review....\n Like  Share',
    ],
  },
}

export const google_review_api: Partial<Scrape> = {
  source: 'google_review_api',
  id_from_source: 'test-google123',
  data: {
    reviews: [
      {
        user_id: '123',
        name: 'Mary Lamb',
        rating: 4.5,
        ago_text: '2 months ago',
        text: 'Test tag was great',
        photos: ['https://i.imgur.com/N6YtgRI.jpeg'],
      },
    ],
  },
}
