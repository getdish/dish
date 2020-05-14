import { Review, useMutation } from '@dish/graph'

export const useReviewMutation = () => {
  return useMutation((schema, variables) => {
    console.log('something something', { schema, variables })
    schema.data.insert_review({
      objects: [
        {
          reviews: [variables.review],
        },
      ],
    })
  })
}
