import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'

import { useUserFavoriteQuery } from '../../hooks/useUserReview'
import { FavoriteButton, FavoriteButtonProps } from '../../views/FavoriteButton'

export type RestaurantFavoriteButtonProps = {
  size?: FavoriteButtonProps['size']
  restaurantId: string
  floating?: boolean
}

export const RestaurantFavoriteStar = memo(
  graphql(({ size, restaurantId, floating }: RestaurantFavoriteButtonProps) => {
    const { favorited, total, toggle } = useUserFavoriteQuery({
      restaurant_id: { _eq: restaurantId },
      type: { _eq: 'favorite' },
    })
    return (
      <Suspense fallback={null}>
        <FavoriteButton floating={floating} isFavorite={!!favorited} onToggle={toggle} size={size}>
          {total > 0 ? total : null}
        </FavoriteButton>
      </Suspense>
    )
  })
)
