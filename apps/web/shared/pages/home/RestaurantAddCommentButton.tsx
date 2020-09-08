import { graphql } from '@dish/graph'
import React from 'react'
import { MessageSquare } from 'react-feather'

import { LinkButton } from '../../views/ui/LinkButton'
import {
  SmallButtonProps,
  smallButtonBaseStyle,
} from '../../views/ui/SmallButton'
import { useUserReviewCommentQuery } from './useUserReview'

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
    restaurantId?: string
    restaurantSlug?: string
  }) => {
    const { review } = useUserReviewCommentQuery(restaurantId)
    return (
      <LinkButton
        {...smallButtonBaseStyle}
        name="restaurantReview"
        params={{ slug: restaurantSlug }}
        fontWeight="600"
        pressStyle={{
          opacity: 0.6,
        }}
        {...props}
      >
        {hideLabel ? '' : !!review?.text ? 'Edit review' : 'Add review'}
        <MessageSquare
          size={size ?? 16}
          opacity={0.5}
          style={{
            margin: -4,
            marginLeft: 5,
          }}
        />
      </LinkButton>
    )
  }
)
