import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { ButtonProps } from 'snackui'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'

export type RestaurantFavoriteButtonProps = ButtonProps & {
  size?: FavoriteButtonProps['size']
  restaurantSlug: string
}

export const RestaurantFavoriteButton = memo(
  graphql(({ restaurantSlug, ...buttonProps }: RestaurantFavoriteButtonProps) => {
    const { favorited, total, toggle } = useUserFavoriteQuery({
      restaurant: {
        slug: {
          _eq: restaurantSlug,
        },
      },
      type: { _eq: 'favorite' },
    })
    return (
      <Suspense fallback={null}>
        <FavoriteButton isFavorite={!!favorited} onToggle={toggle} {...buttonProps}>
          {total > 0 ? total : null}
        </FavoriteButton>
      </Suspense>
    )
  })
)
