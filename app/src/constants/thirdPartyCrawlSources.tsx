export const thirdPartyCrawlSources = {
  dish: {
    name: 'Dish',
    image: require('../assets/icon.png').default,
    delivery: false,
  },
  google: {
    name: 'Google',
    image: require('../assets/google.svg').default,
    delivery: false,
  },
  ubereats: {
    name: 'UberEats',
    image: require('../assets/ubereats.jpg').default,
    delivery: true,
    tagSlug: 'filters__ubereats',
  },
  grubhub: {
    name: 'GrubHub',
    image: require('../assets/grubhub.jpg').default,
    delivery: true,
    tagSlug: 'filters__grubhub',
  },
  doordash: {
    name: 'DoorDash',
    image: require('../assets/doordash.jpg').default,
    delivery: true,
    tagSlug: 'filters__doordash',
  },
  yelp: {
    name: 'Yelp',
    image: require('../assets/yelp.jpg').default,
    delivery: false,
    color: '#C63A38',
  },
  infatuated: {
    name: 'The Infatuation',
    image: require('../assets/the-infatuation.svg').default,
    delivery: false,
  },
  tripadvisor: {
    name: 'TripAdvisor',
    image: require('../assets/tripadvisor.jpg').default,
    delivery: false,
  },
  michelin: {
    name: 'Michelin',
    image: require('../assets/michelin.jpg').default,
    delivery: false,
  },
} as const
