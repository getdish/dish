import { Review, useMutation } from '@dish/graph'

export const useReviewMutation = () => {
  return useMutation((schema, variables) => {
    debugger
    schema.data.insert_review({
      objects: [
        {
          reviews: [variables.review],
        },
      ],
    })
  })
}
