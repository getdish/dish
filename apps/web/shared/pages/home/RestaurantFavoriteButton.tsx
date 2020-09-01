import { graphql } from '@dish/graph'
import React, { memo } from 'react'

import { FavoriteButton, FavoriteButtonProps } from './FavoriteButton'
import { useUserFavoriteQuery } from './useUserReview'

export type RestaurantFavoriteButtonProps = {
  size?: FavoriteButtonProps['size']
  restaurantId: string
}

export const RestaurantFavoriteButton = memo(
  graphql(({ size, restaurantId }: RestaurantFavoriteButtonProps) => {
    const [isFavorite, setIsFavorite] = useUserFavoriteQuery(restaurantId)
    return (
      <FavoriteButton
        isFavorite={!!isFavorite}
        onChange={setIsFavorite}
        size={size}
      />
    )
  })
)
