import { useMutation } from '../../../src/graphql'
import { Review } from '../../types'

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
