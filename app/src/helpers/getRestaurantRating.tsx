export const getRestaurantRating = (rating: number) => rating * 2

export const getRankingColor = (percent: number) =>
  percent >= 8 ? 'green' : percent >= 5 ? 'orange' : 'red'
