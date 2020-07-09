export const thirdPartyCrawlSources = {
  ubereats: {
    name: 'Uber Eats',
    image: require('../../assets/ubereats.jpg').default,
    delivery: true,
  },
  grubhub: {
    name: 'GrubHub',
    image: require('../../assets/grubhub.jpg').default,
    delivery: true,
  },
  doordash: {
    name: 'DoorDash',
    image: require('../../assets/doordash.jpg').default,
    delivery: true,
  },
  yelp: {
    name: 'Yelp',
    image: require('../../assets/yelp.jpg').default,
    delivery: false,
  },
  infatuated: {
    name: 'The Infatuation',
    image: require('../../assets/the-infatuation.svg').default,
    delivery: false,
  },
  tripadvisor: {
    name: 'TripAdvisor',
    image: require('../../assets/tripadvisor.jpg').default,
    delivery: false,
  },
  michelin: {
    name: 'Michelin Guide',
    image: require('../../assets/michelin.jpg').default,
    delivery: false,
  },
}
