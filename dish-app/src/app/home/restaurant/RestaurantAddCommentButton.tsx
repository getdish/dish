import { graphql } from '@dish/graph'
import { Edit } from '@dish/react-feather'
import React from 'react'

import { isWeb } from '../../../constants/constants'
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
        theme="active"
        tooltip="Add comment"
        params={{ slug: restaurantSlug }}
        pressStyle={{
          opacity: 0.6,
        }}
        icon={
          <Edit color={isWeb ? 'var(--color)' : '#000'} size={size ?? 16} />
        }
        {...props}
      >
        {hideLabel ? null : !!review?.text ? 'Edit' : 'Add'}
      </SmallButton>
    )
  }
)
