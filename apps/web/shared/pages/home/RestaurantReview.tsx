import { Text } from '@dish/ui'

import { CommentBubble } from './CommentBubble'

export const RestaurantReview = ({
  userName,
  reviewText,
}: {
  userName: string
  reviewText?: string
}) => {
  return (
    <CommentBubble
      expandable
      ellipseContentAbove={400}
      user={{ username: userName }}
    >
      {reviewText ??
        `Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.`}
    </CommentBubble>
  )
}
