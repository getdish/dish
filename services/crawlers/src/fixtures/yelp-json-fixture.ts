export default {
  '@context': 'http://schema.org/',
  '@type': 'Restaurant',
  priceRange: '$11-30',
  telephone: '+14159326132',
  name: 'Test Name Yelp',
  address: {
    streetAddress: '123 Street',
    addressLocality: 'Big City',
    addressRegion: 'CA',
    postalCode: '94110',
    addressCountry: 'US',
  },
  image: 'https://s3-media0.fl.yelpcdn.com/bphoto/lOPBZqhXrfyJpdsE0tI0dA/348s.jpg',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.0,
    reviewCount: 87,
  },
  servesCuisine: 'Pizza',
} as const
