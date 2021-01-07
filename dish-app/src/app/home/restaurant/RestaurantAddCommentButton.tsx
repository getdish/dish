import { graphql } from '@dish/graph'
import { Edit, MessageSquare } from '@dish/react-feather'
import React from 'react'
import { Text } from 'snackui'

import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'

export const RestaurantAddCommentButton = graphql(
  ({
    restaurantId,
    restaurantSlug,
    size,
    hideLabel,
    ...props
  }: SmallButtonProps & {
    size?: number
    hideLabel?: boolean
    restaurantId: string
    restaurantSlug?: string
  }) => {
    const { review } = useUserReviewCommentQuery(restaurantId)
    return (
      <SmallButton
        name="restaurantReview"
        params={{ slug: restaurantSlug }}
        pressStyle={{
          opacity: 0.6,
        }}
        {...props}
      >
        <Text fontWeight="700" fontSize={14}>
          {hideLabel ? '' : !!review?.text ? 'Edit review' : 'Review'}
        </Text>
        <Edit
          size={size ?? 16}
          style={{
            opacity: 0.5,
            marginRight: -2,
            marginLeft: 8,
          }}
        />
      </SmallButton>
    )
  }
)
