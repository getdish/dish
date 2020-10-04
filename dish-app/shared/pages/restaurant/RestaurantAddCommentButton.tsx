import { graphql } from '@dish/graph'
import { MessageSquare } from '@dish/react-feather'
import { Text } from '@dish/ui'
import React from 'react'

import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { LinkButton } from '../../views/ui/LinkButton'
import {
  SmallButtonProps,
  smallButtonBaseStyle,
} from '../../views/ui/SmallButton'

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
        <Text>
          {hideLabel ? '' : !!review?.text ? 'Edit review' : 'Add review'}
        </Text>
        <MessageSquare
          size={size ?? 16}
          style={{
            opacity: 0.5,
            margin: -4,
            marginLeft: 5,
          }}
        />
      </LinkButton>
    )
  }
)
