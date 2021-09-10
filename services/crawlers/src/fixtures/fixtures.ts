import { Restaurant } from '@dish/graph'

import { YelpScrape } from '../yelp/Yelp'

const GOOGLE_GEOCODER_ID = '0xgoogleid123'

export const restaurant_fixture: Partial<Restaurant> = {
  name: 'Test Name Original',
  geocoder_id: GOOGLE_GEOCODER_ID,
  location: { type: 'Point', coordinates: [0, 0] },
  rating: 3,
  sources: {
    yelp: { url: 'https://www.yelp.com', rating: 3.5 },
    tripadvisor: { url: 'https://tripadvisor.com', rating: 2.5 },
    google: { url: 'https://google.com', rating: 4.5 },
  },
}

export const restaurant_fixture_nearly_matches: Partial<Restaurant> = {
  name: 'Test Name Original Nearly Matches',
  location: { type: 'Point', coordinates: [0, 0] },
}

export type YelpDetailPageData = {
  dynamic: typeof import('../fixtures/yelp-dynamic-fixture').default
  json: typeof import('../fixtures/yelp-json-fixture').default
}

export type YelpPhotosData = typeof import('../fixtures/yelp-photos-fixture').default

export type YelpListItemData = {
  name: string
  street: string
  businessUrl: string
  priceRange: any
  categories: { title: string }[]
  formattedAddress: string
  reviewCount: number
  rating: number
  neighborhoods: string[]
  phone: string
}

interface Photos {
  [key: `photosp${number}`]: { url: string; caption: string }[]
}

interface Reviews {
  [key: `reviewsp${number}`]: YelpReviewData[]
}

export type YelpScrapeData = YelpDetailPageData &
  Reviews &
  Photos & {
    yelp_path: string
    data_from_search_list_item: YelpListItemData
  }

const yelpReview = {
  id: 'abc123',
  tags: [],
  user: {
    src: '',
  },
  photos: [{ src: '', caption: '' }],
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
}

export type YelpReviewData = typeof yelpReview

export const yelp: Partial<YelpScrape> = {
  source: 'yelp',
  id_from_source: 'test123',
  data: {
    yelp_path: '',
    data_from_search_list_item: {
      name: 'Test Name Yelp',
      formattedAddress: '123 Street, Big City, America',
      businessUrl: '',
      categories: [{ title: 'Test Mexican' }, { title: 'Test Pizza' }, { title: 'Test Spain' }],
      rating: 4.0,
      priceRange: '$$',
      reviewCount: 2000,
      street: '123 Street',
      neighborhoods: ['Mission'],
      phone: '(415) 826-7000',
    },
    dynamic: require('./yelp-dynamic-fixture').default,
    json: require('./yelp-json-fixture').default,
    photosp0: [
      {
        url: 'https://i.imgur.com/92a8cNI.jpg',
        caption: 'Test tag existing 1',
      },
    ],
    photosp1: [
      {
        url: 'https://i.imgur.com/N6YtgRI.jpeg',
        caption: 'Test tag existing 2',
      },
    ],
    reviewsp0: [yelpReview],
  },
}

export const ubereats = {
  source: 'ubereats',
  id_from_source: 'test124',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    main: {
      phoneNumber: '',
      location: { address: '123 Street, Big City, America' },
      title: 'Test Name UberEats',
      rating: {
        ratingValue: 4.4,
      },
      metaJson: {},
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

export type UberEatsScrapeData = typeof ubereats['data']

export const doordash = {
  source: 'doordash',
  id_from_source: 'test125',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    storeMenuSeo: '{}',
    main: {
      location: { address: '123 Street, Big City, America' },
      title: 'Test Name DoorDash',
      averageRating: 4.7,
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

export type DoorDashScrapeData = typeof doordash['data']

export const tripadvisor = {
  source: 'tripadvisor',
  id_from_source: 'test123xcv',
  // @ts-ignore weird bug the type is right in graph but comes in null | undefined here
  data: {
    overview: {
      name: 'Test Name Tripadvisor',
      links: {
        warUrl: '',
      },
      detailCard: {
        tagTexts: {
          cuisines: {
            tags: [{ tagValue: 'Test Tripadvisor Mexican' }],
          },
          priceRange: {
            tags: [{ tagValue: 'Low' }],
          },
        },
      },
      contact: {
        website: 'OFdCX2h0dHA6Ly93d3cuaW50ZXJjb250aW5lbnRhbHNhbmZyYW5jaXNjby5jb20vX1o3cQ==',
        address: '',
        phone: '',
      },
      rating: {
        primaryRating: 4,
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

export type TripAdvisorScrapeData = typeof tripadvisor['data']

export const google = {
  source: 'google',
  id_from_source: 'test-google123',
  data: {
    rating: 4,
    hero_image: 'https://i.imgur.com/N6YtgRI.jpeg',
    telephone: '',
    website: '',
    pricing: '',
    reviews: [
      '4 stars\nNikhil Mascarenhas\nLocal Guide ・4 reviews\n 2 weeks ago\nA Google review....\n Like  Share',
      '1 stars\nName\nLocal Guide ・1 review1\n 1 week ago\nA bad review....\n Like  Share',
    ],
  },
}

export type GoogleScrapeData = typeof google['data']

export const google_review_api = {
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

export type GoogleReviewScrapeData = typeof google_review_api['data']
