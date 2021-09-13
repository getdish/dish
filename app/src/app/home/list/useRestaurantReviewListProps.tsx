import { ReviewQueryMutationsProps, useUserReviewQueryMutations } from '../../hooks/useUserReview'
import { getListId } from './getListId'

export const useRestaurantReviewListProps = (
  props: ReviewQueryMutationsProps & {
    listSlug: string
    onEdit?: (text) => any
  }
) => {
  const reviewMutations = useUserReviewQueryMutations(props)
  const { review, listSlug, onEdit } = props
  return {
    onEdit: async (text) => {
      if (!listSlug) return
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
      onEdit?.(text)
    },
    onDelete: () => {
      reviewMutations.deleteReview()
    },
  }
}
