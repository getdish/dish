import { DocumentNode, gql } from '@apollo/client'

export const getUserRestaurantReviews: DocumentNode = gql`
  query GetUserRestaurantReviews($user_id: uuid!, $restaurant_ids: [uuid!]!) {
    review(
      where: {
        user_id: { _eq: $user_id }
        restaurant_id: { _in: $restaurant_ids }
      }
    ) {
      id
      text
      rating
      categories
      restaurant_id
      created_at
      updated_at
    }
  }
`

export const getUserReview: DocumentNode = gql`
  query GetUserReview($user_id: uuid!, $restaurant_id: uuid!) {
    review(
      where: {
        user_id: { _eq: $user_id }
        restaurant_id: { _eq: $restaurant_id }
      }
    ) {
      id
      text
      rating
      categories
      restaurant_id
      created_at
      updated_at
    }
  }
`
