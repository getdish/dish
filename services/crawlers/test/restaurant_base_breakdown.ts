export const breakdown = {
  votes: { score: 0, upvotes: 0, downvotes: 0 },
  photos: {
    score: 0.1,
    critera: 5.25,
    score_factor: 0.1,
    meeting_criteria_count: 1,
  },
  sources: {
    all: {
      ratings: {
        _1: { count: 1, score: -2 },
        _2: { count: 0, score: 0 },
        _3: { count: 0, score: 0 },
        _4: { count: 1, score: 1 },
        _5: { count: 4, score: 8 },
        score: 7,
      },
      summaries: {
        reviews: {
          best: 'Notable Testpho was delicious',
          worst: 'Test tag existing 3 was ok. Vegan',
        },
        sentences: {
          best: ['Notable Testpho was delicious', ' Test tag was amazing.'],
          worst: ['This restaurant had the worst Test tag existing 1 dishes!'],
        },
        unique_tags: [
          {
            id: 'fd6ecb0e-03d5-4eb8-b310-b9f11b64d3d0',
            name: 'Testpho',
          },
        ],
      },
    },
    dish: {
      summaries: {
        reviews: { best: null, worst: null },
        sentences: { best: null, worst: null },
        unique_tags: null,
      },
    },
    yelp: {
      ratings: {
        _1: { count: 0, score: 0 },
        _2: { count: 0, score: 0 },
        _3: { count: 0, score: 0 },
        _4: { count: 0, score: 0 },
        _5: { count: 1, score: 2 },
        score: 2,
      },
      summaries: {
        reviews: {
          best:
            'This restaurant had the worst Test tag existing 1 dishes! Vegetarian An amazing photo of Test tag existing 2!',
          worst:
            'This restaurant had the worst Test tag existing 1 dishes! Vegetarian An amazing photo of Test tag existing 2!',
        },
        sentences: {
          best: [' Vegetarian An amazing photo of Test tag existing 2!'],
          worst: ['This restaurant had the worst Test tag existing 1 dishes!'],
        },
        unique_tags: null,
      },
    },
    google: {
      ratings: {
        _1: { count: 0, score: 0 },
        _2: { count: 0, score: 0 },
        _3: { count: 0, score: 0 },
        _4: { count: 1, score: 1 },
        _5: { count: 0, score: 0 },
        score: 1,
      },
      summaries: {
        reviews: { best: 'Test tag was great', worst: 'Test tag was great' },
        sentences: { best: ['Test tag was great'], worst: null },
        unique_tags: null,
      },
    },
    tripadvisor: {
      ratings: {
        _1: { count: 1, score: -2 },
        _2: { count: 0, score: 0 },
        _3: { count: 0, score: 0 },
        _4: { count: 0, score: 0 },
        _5: { count: 3, score: 6 },
        score: 4,
      },
      summaries: {
        reviews: {
          best: 'Notable Testpho was delicious',
          worst: 'Test tag existing 3 was ok. Vegan',
        },
        sentences: {
          best: ['Notable Testpho was delicious', ' Test tag was amazing.'],
          worst: null,
        },
        unique_tags: [
          {
            id: 'fd6ecb0e-03d5-4eb8-b310-b9f11b64d3d0',
            name: 'Testpho',
          },
        ],
      },
    },
  },
}
