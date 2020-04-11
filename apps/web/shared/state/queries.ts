import { DocumentNode, gql } from '@apollo/client'

export const userRestaurantReviews: DocumentNode = gql`
  query Reviews($user_id: uuid!, $restaurant_ids: [uuid!]!) {
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
