import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'

export type RestaurantFavoriteButtonProps = Partial<FavoriteButtonProps> & {
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
        <FavoriteButton {...buttonProps} onToggle={toggle} isFavorite={!!favorited}>
          {total > 0 ? total : null}
        </FavoriteButton>
      </Suspense>
    )
  })
)
