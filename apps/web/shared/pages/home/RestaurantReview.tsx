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
    <CommentBubble user={{ username: userName }}>
      <Text selectable opacity={0.8} lineHeight={20} fontSize={14}>
        {reviewText ??
          `Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.`}
      </Text>
    </CommentBubble>
  )
}
