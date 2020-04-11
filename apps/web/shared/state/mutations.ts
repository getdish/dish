import { DocumentNode, gql } from '@apollo/client'

export const upsertUserReview: DocumentNode = gql`
  mutation UpsertReview($reviews: [review_insert_input!]!) {
    insert_review(
      objects: $reviews
      on_conflict: {
        constraint: review_user_id_restaurant_id_tag_id_key
        update_columns: [text, rating]
      }
    ) {
      returning {
        id
      }
    }
  }
`
