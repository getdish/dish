import { Review, query } from '@dish/graph'

import { useOvermind } from '../../state/useOvermind'

export const useUserReview = (restaurantId: string): Review | null => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  if (userId) {
    const [review] = query.review({
      limit: 1,
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
        user_id: {
          _eq: userId,
        },
      },
    })
    return review
  }
  return null
}
