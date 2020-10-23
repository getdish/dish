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
        _1: { count: 0, score: 0 },
        _2: { count: 0, score: 0 },
        _3: { count: 0, score: 0 },
        _4: { count: 0, score: 0 },
        _5: { count: 5, score: 10 },
        score: 10,
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
            id: '6831c38e-3680-4d38-a7e2-a9646e162e5d',
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
    tripadvisor: {
      ratings: {
        _1: { count: 0, score: 0 },
        _2: { count: 0, score: 0 },
        _3: { count: 0, score: 0 },
        _4: { count: 0, score: 0 },
        _5: { count: 4, score: 8 },
        score: 8,
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
            id: '6831c38e-3680-4d38-a7e2-a9646e162e5d',
            name: 'Testpho',
          },
        ],
      },
    },
  },
}
