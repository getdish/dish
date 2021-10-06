import { useRefetch } from '@dish/graph'

import { ReviewQueryMutationsProps, useUserReviewQueryMutations } from '../../hooks/useUserReview'
import { getListId } from './getListId'

export const useRestaurantReviewListProps = (
  props: ReviewQueryMutationsProps & {
    listSlug: string
    onEdit?: (text) => any
  }
) => {
  const refetch = useRefetch()
  const reviewMutations = useUserReviewQueryMutations(props)
  const { reviewQuery, review, listSlug, onEdit } = props
  return {
    onEdit: async (text) => {
      if (!listSlug) return
      if (review) {
        review.text = text
      }
      let list_id = review?.list_id
      if (!review?.list_id) {
        // never reviewed before
        list_id = await getListId(props.listSlug)
      }
      reviewMutations.upsertReview({
        ...review,
        type: 'comment',
        list_id,
        text,
      })
      refetch(reviewQuery)
      onEdit?.(text)
    },
    onDelete: () => {
      reviewMutations.deleteReview()
    },
  }
}
