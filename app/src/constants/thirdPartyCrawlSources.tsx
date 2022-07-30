export const thirdPartyCrawlSources = {
  dish: {
    name: 'Dish',
    image: require('../../assets/icon.png'),
    delivery: false,
  },
  google: {
    name: 'Google',
    image: require('../../assets/google.svg'),
    delivery: false,
  },
  ubereats: {
    name: 'UberEats',
    image: require('../../assets/ubereats.jpg'),
    delivery: true,
    tagSlug: 'filters__ubereats',
  },
  grubhub: {
    name: 'GrubHub',
    image: require('../../assets/grubhub.jpg'),
    delivery: true,
    tagSlug: 'filters__grubhub',
  },
  doordash: {
    name: 'DoorDash',
    image: require('../../assets/doordash.jpg'),
    delivery: true,
    tagSlug: 'filters__doordash',
  },
  yelp: {
    name: 'Yelp',
    image: require('../../assets/yelp.jpg'),
    delivery: false,
    color: '#C63A38',
  },
  infatuation: {
    name: 'The Infatuation',
    image: require('../../assets/the-infatuation.svg'),
    delivery: false,
  },
  tripadvisor: {
    name: 'TripAdvisor',
    image: require('../../assets/tripadvisor.jpg'),
    delivery: false,
  },
  michelin: {
    name: 'Michelin',
    image: require('../../assets/michelin.jpg'),
    delivery: false,
  },
} as const
