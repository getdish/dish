import { graphql } from '@dish/graph'
import { Edit } from '@dish/react-feather'
import React from 'react'
import { Theme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { Link } from '../../views/Link'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'

export const RestaurantAddCommentButton = graphql(
  ({
    restaurantSlug,
    size,
    hideLabel,
    ...props
  }: SmallButtonProps & {
    size?: number
    hideLabel?: boolean
    restaurantSlug: string
  }) => {
    const { review } = useUserReviewCommentQuery(restaurantSlug)
    return (
      <Theme name="active">
        <Link name="restaurantReview" params={{ slug: restaurantSlug || '' }}>
          <SmallButton
            tooltip="Add comment"
            pressStyle={{
              opacity: 0.6,
            }}
            elevation={1}
            textProps={{
              fontWeight: '800',
            }}
            icon={<Edit color={isWeb ? 'var(--color)' : '#000'} size={size ?? 16} />}
            {...props}
          >
            {hideLabel ? null : !!review?.text ? 'Edit' : 'Review'}
          </SmallButton>
        </Link>
      </Theme>
    )
  }
)
